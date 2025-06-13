import sqlite3
import time
import os
import logging
import datetime

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Database file
DB_FILE = "user_requests.db"

def ensure_tables_exist():
    """Check if all required tables exist, and create them if they don't."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Check if user_requests table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='user_requests'")
    if not cursor.fetchone():
        logger.info("Creating user_requests table")
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_requests (
            user_id INTEGER NOT NULL,
            chat_id INTEGER NOT NULL,
            gift_name TEXT NOT NULL,
            minute INTEGER NOT NULL,
            PRIMARY KEY (user_id, chat_id, gift_name)
        )
        ''')
    
    # Check if message_owners table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='message_owners'")
    if not cursor.fetchone():
        logger.info("Creating message_owners table")
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS message_owners (
            message_id INTEGER NOT NULL,
            chat_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            timestamp INTEGER NOT NULL,
            PRIMARY KEY (message_id, chat_id)
        )
        ''')
    
    conn.commit()
    conn.close()
    logger.info("All required tables verified or created")

def init_db():
    """Initialize the database if it doesn't exist."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Create the user_requests table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_requests (
        user_id INTEGER NOT NULL,
        chat_id INTEGER NOT NULL,
        gift_name TEXT NOT NULL,
        minute INTEGER NOT NULL,
        PRIMARY KEY (user_id, chat_id, gift_name)
    )
    ''')
    
    # Create message_owners table for delete permission tracking
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS message_owners (
        message_id INTEGER NOT NULL,
        chat_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        PRIMARY KEY (message_id, chat_id)
    )
    ''')
    
    conn.commit()
    conn.close()
    logger.info("Rate limiter database initialized")

def can_user_request(user_id, chat_id, gift_name, cooldown_seconds=None):
    """
    Check if a user can request a specific gift based on clock minute.
    
    Args:
        user_id: Telegram user ID
        chat_id: Telegram chat ID
        gift_name: The name of the gift being requested
        cooldown_seconds: Not used in this implementation, kept for compatibility
        
    Returns:
        tuple: (can_request, seconds_remaining)
    """
    # Get current time details
    now = datetime.datetime.now()
    current_minute = now.minute
    current_second = now.second
    
    # Initialize the database if it doesn't exist
    if not os.path.exists(DB_FILE):
        init_db()
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Get the user's last request minute for this specific gift
    cursor.execute(
        "SELECT minute FROM user_requests WHERE user_id = ? AND chat_id = ? AND gift_name = ?", 
        (user_id, chat_id, gift_name)
    )
    result = cursor.fetchone()
    
    if result:
        last_minute = result[0]
        
        # Check if we're still in the same minute
        if last_minute == current_minute:
            # User has already requested this gift in this minute
            # Calculate seconds until next minute
            seconds_remaining = 60 - current_second
            conn.close()
            return False, seconds_remaining
    
    # Update the user's request minute for this gift
    cursor.execute(
        "INSERT OR REPLACE INTO user_requests (user_id, chat_id, gift_name, minute) VALUES (?, ?, ?, ?)",
        (user_id, chat_id, gift_name, current_minute)
    )
    
    conn.commit()
    conn.close()
    
    return True, 0

def reset_user_cooldown(user_id, chat_id, gift_name=None):
    """
    Reset a user's cooldown (for testing).
    
    Args:
        user_id: Telegram user ID
        chat_id: Telegram chat ID
        gift_name: Optional gift name to reset cooldown for a specific gift
    """
    if not os.path.exists(DB_FILE):
        return
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    if gift_name:
        cursor.execute(
            "DELETE FROM user_requests WHERE user_id = ? AND chat_id = ? AND gift_name = ?",
            (user_id, chat_id, gift_name)
        )
    else:
        cursor.execute(
            "DELETE FROM user_requests WHERE user_id = ? AND chat_id = ?",
            (user_id, chat_id)
        )
    
    conn.commit()
    conn.close()

def register_message(user_id, chat_id, message_id):
    """
    Record which user created which message for deletion permissions.
    
    Args:
        user_id: Telegram user ID who requested the message
        chat_id: Telegram chat ID where the message was sent
        message_id: ID of the message to register
    """
    # Initialize the database if it doesn't exist
    if not os.path.exists(DB_FILE):
        init_db()
    else:
        # Ensure the message_owners table exists
        ensure_tables_exist()
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Store the message ownership
    cursor.execute(
        "INSERT OR REPLACE INTO message_owners VALUES (?, ?, ?, ?)",
        (message_id, chat_id, user_id, int(time.time()))
    )
    
    conn.commit()
    conn.close()
    logger.info(f"Registered message {message_id} in chat {chat_id} to user {user_id}")

def can_delete_message(user_id, chat_id, message_id):
    """
    Check if user can delete this message (owner or admin).
    
    Args:
        user_id: Telegram user ID requesting deletion
        chat_id: Telegram chat ID where the message is
        message_id: ID of the message to delete
        
    Returns:
        bool: True if user is allowed to delete the message
    """
    try:
        # Initialize the database if it doesn't exist
        if not os.path.exists(DB_FILE):
            init_db()
            # New DB won't have any messages registered, but we'll allow deletion for compatibility
            logger.info(f"DB not found, allowing deletion of message {message_id}")
            return True
        else:
            # Ensure the message_owners table exists
            ensure_tables_exist()
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Check if this message is registered
        cursor.execute(
            "SELECT user_id FROM message_owners WHERE message_id = ? AND chat_id = ?",
            (message_id, chat_id)
        )
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            # Message not in database, allow deletion for compatibility with older messages
            logger.info(f"Message {message_id} not found in database, allowing deletion")
            return True
            
        owner_id = result[0]
        
        # Check if this user is the owner of the message
        # We could add a check for admin status here as well, but for now we'll just check for ownership
        if user_id == owner_id:
            logger.info(f"User {user_id} is authorized to delete message {message_id}")
            return True
        else:
            logger.info(f"User {user_id} is NOT the owner ({owner_id}) of message {message_id}, denying deletion")
            return False
    except Exception as e:
        # On error, allow deletion rather than blocking functionality
        logger.error(f"Error checking message ownership: {e}")
        return True 