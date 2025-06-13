import os
import random
import logging
import re
import time
import datetime
import asyncio
import socket
import warnings
from difflib import get_close_matches
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, InlineQueryResultPhoto, InputMediaPhoto, InlineQueryResultArticle, InputTextMessageContent
from telegram.constants import MessageEntityType, ParseMode
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, ContextTypes, filters, InlineQueryHandler
from uuid import uuid4
from telegram.error import TelegramError, NetworkError
from httpx import HTTPError, ConnectError, ProxyError

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Import bot configuration
try:
    from bot_config import BOT_TOKEN, BOT_USERNAME, RESPOND_TO_ALL_MESSAGES, USE_DIRECT_IP, API_TELEGRAM_IP, SKIP_SSL_VERIFY, SPECIAL_GROUPS, DEFAULT_BUY_SELL_LINK
except ImportError:
    # Default values if config file is missing
    BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "YOUR_TOKEN_HERE")
    BOT_USERNAME = "@YourBotUsername"
    RESPOND_TO_ALL_MESSAGES = False
    USE_DIRECT_IP = False
    API_TELEGRAM_IP = "149.154.167.220"
    SKIP_SSL_VERIFY = False
    SPECIAL_GROUPS = {}
    DEFAULT_BUY_SELL_LINK = "https://t.me/tonnel_network_bot/gifts?startapp=ref_7660176383"

# Enable logging (with reduced verbosity for HTTP requests)
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
# Reduce logging for HTTP requests
logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)  # Use INFO level instead of DEBUG for less verbosity

# Get path to gift cards
GIFT_CARDS_DIR = os.path.join(script_dir, "new_gift_cards")

# Get available gift names from the main.py file
try:
    from main import names
except ImportError:
    # Fallback names list if we can't import from main.py
    names = [
        "Heart Locket", "Lush Bouquet", "Astral Shard", "B-Day Candle", "Berry Box",
        "Big Year", "Bonded Ring", "Bow Tie", "Bunny Muffin", "Candy Cane",
        "Cookie Heart", "Crystal Ball", "Desk Calendar", "Diamond Ring", "Durov's Cap",
        "Easter Egg", "Electric Skull", "Eternal Candle", "Eternal Rose", "Evil Eye",
        "Flying Broom", "Gem Signet", "Genie Lamp", "Ginger Cookie", "Hanging Star",
        "Heroic Helmet", "Hex Pot", "Holiday Drink", "Homemade Cake", "Hypno Lollipop",
        "Ion Gem", "Jack-in-the-Box", "Jelly Bunny", "Jester Hat", "Jingle Bells",
        "Kissed Frog", "Light Sword", "Lol Pop", "Loot Bag", "Love Candle",
        "Love Potion", "Lunar Snake", "Mad Pumpkin", "Magic Potion", "Mini Oscar",
        "Nail Bracelet", "Neko Helmet", "Party Sparkler", "Perfume Bottle", "Pet Snake",
        "Plush Pepe", "Precious Peach", "Record Player", "Restless Jar", "Sakura Flower",
        "Santa Hat", "Scared Cat", "Sharp Tongue", "Signet Ring", "Skull Flower",
        "Sleigh Bell", "Snake Box", "Snow Globe", "Snow Mittens", "Spiced Wine",
        "Spy Agaric", "Star Notepad", "Swiss Watch", "Tama Gadget", "Top Hat",
        "Toy Bear", "Trapped Heart", "Vintage Cigar", "Voodoo Doll", "Winter Wreath",
        "Witch Hat", "Xmas Stocking"
    ]

# Create a lowercase and simplified version of each name for better matching
simplified_names = {}
# Only exclude these very common words as parts
exclude_words = ["the", "and", "of", "for", "with", "in", "on", "at", "by"]

for name in names:
    # Create variations of the name for matching
    simple_name = name.lower().replace('-', ' ').replace("'", '')
    simplified_names[simple_name] = name
    
    # Add hyphenated variations if applicable
    if "-" in name:
        no_hyphen = name.lower().replace("-", " ")
        simplified_names[no_hyphen] = name
    
    # Add apostrophe variations if applicable
    if "'" in name:
        no_apostrophe = name.lower().replace("'", "")
        simplified_names[no_apostrophe] = name
    
    # Add individual parts of names for better partial matching
    parts = simple_name.split()
    for part in parts:
        # Only add substantial parts (3+ chars) that aren't common words
        if len(part) >= 3 and part not in exclude_words:
            # For ambiguous words (same part in multiple gifts), we'll still add them
            # This makes matching more inclusive but might lead to multiple matches
            simplified_names[part] = name

# Import the callback handler and image uploader
try:
    # Import the callback handler from the external module
    from callback_handler import callback_handler as external_callback_handler
    
    # Create a wrapper function that will use the imported handler
    async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Forward callback queries to the proper handler in callback_handler.py"""
        await external_callback_handler(update, context)
        
except ImportError:
    logger.warning("Callback handler not found. Creating a basic one.")
    async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        query = update.callback_query
        await query.answer()
        await query.message.reply_text("Callback handling is not fully set up.")

# Import the image uploader
try:
    from image_uploader import get_gift_card_url
    IMAGE_UPLOADER_AVAILABLE = True
    logger.info("Image uploader available.")
except ImportError:
    logger.warning("Image uploader not available. Inline images will not work correctly.")
    IMAGE_UPLOADER_AVAILABLE = False

# We use catbox.moe for image hosting via image_uploader.py

# Function to get a gift card by name
def get_gift_card_by_name(gift_name):
    # Normalize gift name for file matching
    normalized_name = gift_name.replace(" ", "_")
    
    # Handle special characters in filenames
    if gift_name == "Jack-in-the-Box":
        normalized_name = "Jack_in_the_Box"
    elif gift_name == "Durov's Cap":
        normalized_name = "Durovs_Cap"
    else:
        normalized_name = gift_name.replace(" ", "_").replace("-", "_").replace("'", "")
    
    filename = f"{normalized_name}_card.png"
    filepath = os.path.join(GIFT_CARDS_DIR, filename)
    
    # Check if file exists
    if os.path.exists(filepath):
        return filepath
    
    # If not, it might be a name we need to generate
    return None

# Get pre-generated gift card (no on-demand generation)
def generate_gift_card(gift_file_name):
    try:
        # Convert file_name to display name for the card generator
        gift_display_name = gift_file_name.replace("_", " ")
        
        # Normalize the filename for file system compatibility
        # First, fix specific problematic gift names
        if gift_file_name == "Jack-in-the-Box":
            normalized_filename = "Jack_in_the_Box"
        elif gift_file_name == "Durov's Cap":
            normalized_filename = "Durovs_Cap"
        else:
            # General normalization for other names
            normalized_filename = gift_file_name.replace("-", "_").replace("'", "")
        
        # Check if the pre-generated card exists
        card_path = get_gift_card_by_name(gift_file_name)
        if card_path:
            return card_path
            
        # If card doesn't exist, check if we need to regenerate all cards
        timestamp_file = os.path.join(script_dir, "last_generation_time.txt")
        current_time = int(time.time())
        
        if os.path.exists(timestamp_file):
            try:
                with open(timestamp_file, 'r') as f:
                    last_time = int(f.read().strip())
                
                elapsed_minutes = (current_time - last_time) / 60
                
                # If more than 32 minutes have passed, regenerate cards
                if elapsed_minutes >= 32:
                    logging.info("Cards are stale, triggering regeneration")
                    # Run the pregeneration script in the background
                    subprocess.Popen([sys.executable, os.path.join(script_dir, "pregenerate_gift_cards.py")])
            except Exception as e:
                logging.error(f"Error checking timestamp: {e}")
        else:
            # No timestamp file, trigger regeneration
            logging.info("No timestamp file found, triggering regeneration")
            subprocess.Popen([sys.executable, os.path.join(script_dir, "pregenerate_gift_cards.py")])
        
        # Try one more time to get the card (it might exist now)
        card_path = get_gift_card_by_name(gift_file_name)
        if card_path:
            return card_path
            
        # If we still don't have the card, generate it on demand as a fallback
        logging.info(f"Pre-generated card not found for {gift_file_name}, generating on demand")
        import new_card_design
        new_card_design.generate_specific_gift(gift_display_name)
        
        # Get the card path using the file_name format
        return get_gift_card_by_name(gift_file_name)
    except Exception as e:
        logging.error(f"Error getting gift card for {gift_file_name}: {e}")
        return None

# Get list of all available gift cards in the directory
def get_available_gift_cards():
    if os.path.exists(GIFT_CARDS_DIR):
        return [f for f in os.listdir(GIFT_CARDS_DIR) if f.endswith('_card.png')]
    return []

# Function to get a random gift card
def get_random_gift_card():
    available_cards = get_available_gift_cards()
    if not available_cards:
        return None
    return os.path.join(GIFT_CARDS_DIR, random.choice(available_cards))

# Convert filename to display name
def get_gift_name(filename):
    # Remove _card.png and replace underscores with spaces
    return os.path.splitext(filename)[0].replace('_card', '').replace('_', ' ')

# Enhanced function to find matching gifts
def find_matching_gifts(query):
    # Ignore extremely short queries to avoid false matches
    if len(query.strip()) < 2:
        return []
        
    query = query.lower().replace('-', ' ').replace("'", '')
    matching_gifts = []
    
    # Gift groups for disambiguation
    gift_groups = {
        "ring": ["Diamond Ring", "Bonded Ring", "Signet Ring"],
        "hat": ["Jester Hat", "Santa Hat", "Top Hat", "Witch Hat", "Durov's Cap"],
        "heart": ["Heart Locket", "Cookie Heart", "Trapped Heart"],
        "candle": ["B-Day Candle", "Eternal Candle", "Love Candle"],
        "snake": ["Pet Snake", "Lunar Snake", "Snake Box"],
        "box": ["Berry Box", "Snake Box", "Loot Bag"],
        "bunny": ["Bunny Muffin", "Jelly Bunny"],
        "signet": ["Gem Signet", "Signet Ring"],
        "potion": ["Magic Potion", "Love Potion"],
        "bell": ["Jingle Bells", "Sleigh Bell"],
        "pad": ["Star Notepad"],
        "pepe": ["Plush Pepe"],
        "peach": ["Precious Peach"],
        "plush": ["Plush Pepe"]
    }
    
    # Check if query exactly matches a gift group
    if query.lower() in gift_groups:
        return gift_groups[query.lower()]  # Return the whole group for disambiguation
    
    # Skip common phrases
    common_phrases = [
        "thank you", "hello there", "how are you", "what's up", 
        "good morning", "good evening", "good night", "see you later"
    ]
    
    # Check if query is a common phrase
    if query in common_phrases:
        return []
    
    # Expanded list of common words to avoid false matches
    very_common_words = [
        "thanks", "hello", "hey", "hi", "ok", "yes", "no", "ton", "and", "the", 
        "for", "too", "get", "got", "how", "when", "where", "why", "who", "what", 
        "that", "this", "then", "there"
    ]
    
    # Check if query is just a single common word
    query_words = query.split()
    if len(query_words) == 1 and query in very_common_words:
        return []
    
    # Check for exact matches in simplified names first
    if query in simplified_names:
        matching_gifts.append(simplified_names[query])
        return matching_gifts
    
    # First try exact gift name matches (case insensitive)
    for simple_name, original_name in simplified_names.items():
        if query == simple_name:
            if original_name not in matching_gifts:
                matching_gifts.append(original_name)
            return matching_gifts  # Return immediately for exact matches
    
    # Special prioritized partial matches (more accurate)
    special_matches = {
        "pepe": "Plush Pepe",
        "peach": "Precious Peach",
        "plush": "Plush Pepe",
        "precious": "Precious Peach",
        "pad": "Star Notepad",
        "notepad": "Star Notepad",
        "gadget": "Tama Gadget",
        "tama": "Tama Gadget",
        "diamond": "Diamond Ring",
        "locket": "Heart Locket",
        "jack": "Jack-in-the-Box",
        "durov": "Durov's Cap",
        "cap": "Durov's Cap"
    }
    
    # Check for special partial matches
    for keyword, gift in special_matches.items():
        if query == keyword or (len(query) >= 3 and keyword.startswith(query)):
            if gift not in matching_gifts:
                matching_gifts.append(gift)
    
    # If we found special matches, return them first
    if matching_gifts:
        return matching_gifts
    
    # Then try partial word matching with improved logic
    for simple_name, original_name in simplified_names.items():
        # Skip if we already have this gift in our matches
        if original_name in matching_gifts:
            continue
            
        # Split the gift name into words
        name_words = simple_name.split()
        
        # Check if any query word is a substantial part of a gift name word
        for query_word in query_words:
            # Only match if query word is at least 3 characters and not a common word
            if len(query_word) >= 3 and query_word not in very_common_words:
                # Check if query word is the start of any gift name word
                if any(word.startswith(query_word) for word in name_words):
                    if original_name not in matching_gifts:
                        matching_gifts.append(original_name)
                        break
                
                # Check if query is a significant portion of a longer word (at least 60% of the word)
                for word in name_words:
                    if len(word) >= 4 and query_word in word and len(query_word) >= 0.6 * len(word):
                        if original_name not in matching_gifts:
                            matching_gifts.append(original_name)
                            break
    
    # If still no matches, check if any gift name contains the entire query
    if not matching_gifts and len(query) >= 3 and query not in very_common_words:
        for simple_name, original_name in simplified_names.items():
            if query in simple_name and original_name not in matching_gifts:
                matching_gifts.append(original_name)
    
    # If still no matches, try fuzzy matching with a moderate threshold
    if not matching_gifts and len(query) >= 3 and query not in very_common_words:
        # Get all simplified names as a list
        all_simple_names = list(simplified_names.keys())
        
        # Find close matches
        close_matches = get_close_matches(query, all_simple_names, n=3, cutoff=0.75)
        
        # Add the corresponding original names
        for match in close_matches:
            if match in simplified_names and simplified_names[match] not in matching_gifts:
                matching_gifts.append(simplified_names[match])
    
    # Remove any duplicates and limit to 5 results to avoid overwhelming the user
    return list(dict.fromkeys(matching_gifts))[:5]

# Create a keyboard with gift categories
def get_category_keyboard():
    categories = [
        "Popular", "Holiday", "Seasonal", "Decorative", "Toys", 
        "Magical", "Food", "Accessories", "View All"
    ]
    
    keyboard = []
    row = []
    for i, category in enumerate(categories):
        row.append(InlineKeyboardButton(category, callback_data=f"category_{category}"))
        
        # Create rows with 3 buttons each
        if (i + 1) % 3 == 0 or i == len(categories) - 1:
            keyboard.append(row)
            row = []
    
    # Add a "Random" button
    keyboard.append([InlineKeyboardButton("🎲 Random Gift", callback_data="random_gift")])
    
    return InlineKeyboardMarkup(keyboard)

# Create a keyboard with gifts from a specific category or paginated gifts
def get_gift_keyboard(category=None, page=0):
    # Filter gifts by category if provided
    if category and category != "View All":
        # Define which gifts belong to which category (simplified)
        category_mapping = {
            "Popular": ["Plush Pepe", "Diamond Ring", "Heart Locket", "Eternal Rose", "Durov's Cap"],
            "Holiday": ["Christmas Hat", "Xmas Stocking", "Santa Hat", "Candy Cane", "Winter Wreath"],
            "Seasonal": ["Easter Egg", "Bunny Muffin", "Halloween Pumpkin", "Valentine Heart"],
            "Decorative": ["Snow Globe", "Hanging Star", "Eternal Candle", "Crystal Ball"],
            "Toys": ["Jack-in-the-Box", "Toy Bear", "Loot Bag", "Tama Gadget"],
            "Magical": ["Magic Potion", "Love Potion", "Genie Lamp", "Witch Hat"],
            "Food": ["Ginger Cookie", "Spiced Wine", "Cookie Heart", "Berry Box"],
            "Accessories": ["Top Hat", "Bow Tie", "Swiss Watch", "Signet Ring"]
        }
        
        # Get gifts for this category
        filtered_gifts = [name for name in names if any(name.lower() in gift.lower() or gift.lower() in name.lower() 
                                                     for gift in category_mapping.get(category, []))]
    else:
        # Use all gifts
        filtered_gifts = names
    
    # Paginate gifts (8 per page)
    items_per_page = 8
    total_pages = (len(filtered_gifts) + items_per_page - 1) // items_per_page
    
    start_idx = page * items_per_page
    end_idx = min(start_idx + items_per_page, len(filtered_gifts))
    page_gifts = filtered_gifts[start_idx:end_idx]
    
    # Create buttons for each gift
    keyboard = []
    row = []
    for i, gift_name in enumerate(page_gifts):
        row.append(InlineKeyboardButton(gift_name, callback_data=f"gift_{gift_name}"))
        
        # Create rows with 2 buttons each
        if i % 2 == 1 or i == len(page_gifts) - 1:
            keyboard.append(row)
            row = []
    
    # Add navigation buttons
    nav_row = []
    if page > 0:
        nav_row.append(InlineKeyboardButton("⬅️ Previous", callback_data=f"page_{page-1}_{category}"))
    if page < total_pages - 1:
        nav_row.append(InlineKeyboardButton("Next ➡️", callback_data=f"page_{page+1}_{category}"))
    
    if nav_row:
        keyboard.append(nav_row)
    
    # Add a back button to categories
    keyboard.append([InlineKeyboardButton("🔙 Back to Categories", callback_data="back_to_categories")])
    
    return InlineKeyboardMarkup(keyboard)

# Generate a timestamped card for refresh functionality
def generate_timestamped_card(gift_file_name):
    try:
        # Convert file_name to display name for the card generator
        gift_display_name = gift_file_name.replace("_", " ")
        
        # Normalize the filename for file system compatibility
        # First, fix specific problematic gift names
        if gift_file_name == "Jack-in-the-Box":
            normalized_filename = "Jack_in_the_Box"
        elif gift_file_name == "Durov's Cap":
            normalized_filename = "Durovs_Cap"
        else:
            # General normalization for other names
            normalized_filename = gift_file_name.replace("-", "_").replace("'", "")
        
        # Generate with timestamp suffix to ensure it's fresh
        import new_card_design
        timestamp = int(time.time())
        output_path = new_card_design.generate_specific_gift(gift_display_name, f"_{timestamp}")
        
        return output_path
    except Exception as e:
        logging.error(f"Error generating timestamped card for {gift_file_name}: {e}")
        return None

# Function to generate a price card for a gift with refresh option
async def generate_gift_price_card(gift_file_name, refresh=False):
    """Generate a price card for a gift with option to refresh."""
    if refresh:
        # Generate with timestamp to ensure it's fresh
        return generate_timestamped_card(gift_file_name)
    else:
        # Use standard generation
        return generate_gift_card(gift_file_name)

# Function to refresh a price card
async def refresh_price_card(update: Update, context: ContextTypes.DEFAULT_TYPE, gift_name):
    """Refresh a price card with latest data."""
    query = update.callback_query
    chat_id = query.message.chat_id
    message_id = query.message.message_id
    
    # Generate fresh card and update the message
    await send_gift_card(update, context, gift_name, edit_message_id=message_id, chat_id=chat_id)

# Handle gift command from regex match
async def handle_gift_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle the /gift_NAME command from regex match."""
    if not update.message or not update.message.text:
        return
    
    # Extract gift name from the command
    match = re.match(r"^/gift_([A-Za-z0-9_]+)$", update.message.text)
    if match:
        gift_name = match.group(1).replace("_", " ")
        await send_gift_card(update, context, gift_name)

# Handle price command
async def handle_price_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle the /price GIFT_NAME command."""
    if not update.message or not update.message.text:
        return
    
    # Extract gift name from the command
    match = re.match(r"^/price (.+)$", update.message.text)
    if match:
        gift_name = match.group(1).strip()
        await send_gift_card(update, context, gift_name)

# Function to generate gift card with buttons
async def send_gift_card(update: Update, context: ContextTypes.DEFAULT_TYPE, gift_name, edit_message_id=None, chat_id=None):
    """Generate and send a gift card with buttons."""
    # Get the standard card path
    card_path = generate_gift_card(gift_name)
    
    if not card_path:
        if edit_message_id:
            await context.bot.edit_message_text(
                chat_id=chat_id,
                message_id=edit_message_id,
                text=f"Sorry, couldn't generate the gift card for {gift_name}."
            )
        else:
            await update.message.reply_text(f"Sorry, couldn't generate the gift card for {gift_name}.")
        return
    
    # Get the chat ID for checking if this is a special group
    current_chat_id = chat_id if chat_id else update.effective_chat.id
    
    # Create keyboard based on the chat ID
    keyboard = []
    
    # Check if this is a special group that needs custom buttons
    if current_chat_id in SPECIAL_GROUPS:
        # This is a special group, use custom referral links
        group_config = SPECIAL_GROUPS[current_chat_id]
        buy_sell_link = group_config["buy_sell_link"]
        portal_link = group_config["portal_link"]
        
        # Create three buttons for special groups
        keyboard = [
            [
                InlineKeyboardButton("💰 Buy/Sell Gifts", url=buy_sell_link),
                InlineKeyboardButton("🌐 Portal", url=portal_link)
            ],
            [
                InlineKeyboardButton("🗑️ Delete", callback_data="delete")
            ]
        ]
    else:
        # Regular chat, use default configuration with just two buttons
        keyboard = [
            [
                InlineKeyboardButton("💰 Buy/Sell Gifts", url=DEFAULT_BUY_SELL_LINK)
            ],
            [
                InlineKeyboardButton("🗑️ Delete", callback_data="delete")
            ]
        ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    try:
        # Send or edit the message with the photo
        if edit_message_id and chat_id:
            # When editing an existing message
            with open(card_path, 'rb') as photo_file:
                await context.bot.edit_message_media(
                    chat_id=chat_id,
                    message_id=edit_message_id,
                    media=InputMediaPhoto(
                        media=photo_file,
                        caption=f"🎁 {gift_name}"
                    ),
                    reply_markup=reply_markup
                )
        else:
            # When sending a new message
            with open(card_path, 'rb') as photo_file:
                sent_message = await update.message.reply_photo(
                    photo=photo_file,
                    caption=f"🎁 {gift_name}",
                    reply_markup=reply_markup
                )
            
            # Register the message owner in the database for delete permission tracking
            try:
                from rate_limiter import register_message
                user_id = update.effective_user.id
                chat_id = update.effective_chat.id
                register_message(user_id, chat_id, sent_message.message_id)
                logging.info(f"Registered message {sent_message.message_id} to user {user_id}")
            except ImportError:
                logging.warning("Rate limiter not available, message ownership not registered")
            except Exception as e:
                logging.error(f"Error registering message ownership: {e}")
            
    except Exception as e:
        logging.error(f"Error sending card: {e}")
        if edit_message_id and chat_id:
            try:
                await context.bot.edit_message_caption(
                    chat_id=chat_id,
                    message_id=edit_message_id,
                    caption=f"🎁 {gift_name}"
                )
            except:
                pass

# Command handler for /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    user = update.effective_user
    
    # Get user and chat info for rate limiting
    user_id = update.effective_user.id
    chat_id = update.effective_chat.id
    
    # Apply rate limiting for start command
    try:
        from rate_limiter import can_user_request
        can_request, seconds_remaining = can_user_request(user_id, chat_id, "start_command")
        
        if not can_request:
            # User is rate limited for this command
            if seconds_remaining > 0:
                # Only notify in private chats to avoid spam
                is_private = update.message.chat.type == "private"
                
                if is_private:
                    await update.message.reply_text(
                        f"⏱️ Please wait {seconds_remaining} seconds before using this command again.",
                        reply_to_message_id=update.message.message_id
                    )
            return
    except ImportError:
        # Rate limiter not available, continue without rate limiting
        logger.warning("Rate limiter not available, continuing without rate limiting")
    
    # Send the welcome video first
    with open("/home/yousefmsm1/Desktop/Project_Gift_Price/assets/start.mp4", "rb") as video:
        await update.message.reply_video(
            video=video,
            caption=f"Hi {user.mention_html()}! I'm the Telegram Gift Price Bot. ✨\n\n"
                    f"I can show you price cards for Telegram gifts with modern cool chart photos. 📊\n\n"
                    f"Add @{BOT_USERNAME[1:]} to your public/private group - no admin privileges needed! "
                    f"Just type any gift name in the chat and have fun! 🎁",
            parse_mode=ParseMode.HTML
        )

# Command handler for /help
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    # Get user and chat info for rate limiting
    user_id = update.effective_user.id
    chat_id = update.effective_chat.id
    
    # Apply rate limiting for help command
    try:
        from rate_limiter import can_user_request
        can_request, seconds_remaining = can_user_request(user_id, chat_id, "help_command")
        
        if not can_request:
            # User is rate limited for this command
            if seconds_remaining > 0:
                # Only notify in private chats to avoid spam
                is_private = update.message.chat.type == "private"
                
                if is_private:
                    await update.message.reply_text(
                        f"⏱️ Please wait {seconds_remaining} seconds before using this command again.",
                        reply_to_message_id=update.message.message_id
                    )
            return
    except ImportError:
        # Rate limiter not available, continue without rate limiting
        logger.warning("Rate limiter not available, continuing without rate limiting")
    
    await update.message.reply_text(
        "Here's how to use the Gift Price Bot:\n\n"
        "/start - Start the bot\n"
        "/help - Show this help message\n\n"
        "You can also just send me the name of a gift, and I'll try to find it!"
    )

# Command handler for /gift
async def gift_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send gift category options when the command /gift is issued."""
    await update.message.reply_text(
        "Choose a gift category to browse:",
        reply_markup=get_category_keyboard()
    )

# Command handler for /random
async def random_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a random gift price card when the command /random is issued."""
    # Choose a random gift name
    gift_name = random.choice(names)
    
    # Send the gift card
    await send_gift_card(update, context, gift_name)

# Add a search command to find specific gifts
async def search_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Allow users to search for specific gifts."""
    query = " ".join(context.args)
    
    if not query:
        await update.message.reply_text("Please provide a gift name to search for. Example: /search Plush Pepe")
        return
    
    # Use the enhanced matching function
    matching_gifts = find_matching_gifts(query)
    
    if matching_gifts:
        if len(matching_gifts) == 1:
            # Exact match found
            gift_name = matching_gifts[0]
            await send_gift_card(update, context, gift_name)
            return
        else:
            # Multiple matches found
            keyboard = []
            row = []
            for i, name in enumerate(matching_gifts[:8]):  # Limit to 8 results
                row.append(InlineKeyboardButton(name, callback_data=f"gift_{name}"))
                if i % 2 == 1 or i == len(matching_gifts[:8]) - 1:
                    keyboard.append(row)
                    row = []
            
            # No delete button for selection menus per user request
            
            reply_markup = InlineKeyboardMarkup(keyboard)
            sent_message = await update.message.reply_text(
                f"I found multiple possible gifts. Please select one:",
                reply_markup=reply_markup
            )
            
            # Register the message owner in the database for delete permission tracking
            try:
                from rate_limiter import register_message
                user_id = update.effective_user.id
                chat_id = update.effective_chat.id
                register_message(user_id, chat_id, sent_message.message_id)
                logging.info(f"Registered search results message {sent_message.message_id} to user {user_id}")
            except ImportError:
                logging.warning("Rate limiter not available, message ownership not registered")
            except Exception as e:
                logging.error(f"Error registering message ownership: {e}")
            
            return
    
    # If we get here, no matching gift was found
    await update.message.reply_text(f"Sorry, I couldn't find a gift matching '{query}'.")

# Function to handle inline queries
async def inline_query(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle the inline queries."""
    query = update.inline_query.query.lower()
    user_id = update.inline_query.from_user.id
    logger.info(f"Received inline query: '{query}' from user {user_id}")
    
    # Determine which gifts to show based on query
    if not query:
        # Show the specified default gifts
        gifts_to_show = ["Plush Pepe", "Heart Locket", "Durov's Cap", "Precious Peach", "Heroic Helmet"]
        logger.info(f"Empty query, showing default gifts: {gifts_to_show}")
    else:
        # Filter gifts that match the query
        gifts_to_show = find_matching_gifts(query)
        
        # If no gifts match, show a message
        if not gifts_to_show:
            logger.info(f"No gifts found for query: '{query}'")
            results = [
                InlineQueryResultArticle(
                    id=str(uuid4()),
                    title="No gifts found",
                    description="Try a different search term",
                    input_message_content=InputTextMessageContent(
                        message_text="No gifts found. Try searching for something else."
                    )
                )
            ]
            await update.inline_query.answer(results, cache_time=5)
            return
        
        # Limit the number of results
        gifts_to_show = gifts_to_show[:5]
    
    # Get price data for all gifts in advance (much faster than processing one by one)
    price_data = {}
    try:
        import new_card_design
        for gift in gifts_to_show:
            gift_data = new_card_design.fetch_gift_data(gift)
            if gift_data:
                price_data[gift] = {
                    "price_usd": float(gift_data.get("priceUsd", 0)),
                    "price_ton": float(gift_data.get("priceTon", 0)),
                    "change_pct": float(gift_data.get("changePercentage", 0))
                }
            else:
                # Default values if data not available
                price_data[gift] = {
                    "price_usd": 5000,
                    "price_ton": 1500,
                    "change_pct": 0
                }
    except Exception as e:
        logger.error(f"Error getting price data: {e}")
        # Use default values for all gifts
        for gift in gifts_to_show:
            price_data[gift] = {
                "price_usd": 5000,
                "price_ton": 1500,
                "change_pct": 0
            }
    
    # Create results with buttons only (no images)
    results = []
    for gift in gifts_to_show:
        result_id = str(uuid4())
        gift_file_name = "_".join(gift.split())
        
        # Get the gift price data
        gift_price = price_data[gift]
        price_usd = gift_price["price_usd"]
        price_ton = gift_price["price_ton"]
        change_pct = gift_price["change_pct"]
        
        # Format the change percentage with sign
        change_sign = "+" if change_pct >= 0 else ""
        change_formatted = f"{change_sign}{change_pct:.2f}"
        
        # Prepare the basic message
        base_message = f"💎 <b>{gift}</b> 💎\n\n{price_ton:.1f} TON = ${price_usd:,.0f} USD ({change_formatted}%)"
        
        # Create a result with text and a button
        results.append(
            InlineQueryResultArticle(
                id=result_id,
                title=f"{gift}",
                description=f"{price_ton:.1f} TON = ${price_usd:,.0f} USD ({change_formatted}%)",
                input_message_content=InputTextMessageContent(
                    message_text=base_message,
                    parse_mode=ParseMode.HTML
                ),
                reply_markup=InlineKeyboardMarkup([
                    [InlineKeyboardButton("Show Price Card", callback_data=f"gift_{gift_file_name}")]
                ])
            )
        )
    
    # Answer with the results immediately
    try:
        await update.inline_query.answer(results, cache_time=60)
        logger.info(f"Sent inline query results")
    except Exception as e:
        logger.error(f"Error sending inline query results: {e}")

# Add a new function for the FOMO Easter egg after all other functions
async def handle_fomo_easter_egg(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle the FOMO Easter egg when a user types 'fomo' or 'فوموا'"""
    try:
        # Path for the FOMO card
        fomo_card_path = os.path.join(GIFT_CARDS_DIR, "FOMO_card.png")
        
        # Check if the card exists
        if not os.path.exists(fomo_card_path):
            logger.error(f"FOMO card not found at {fomo_card_path}")
            await update.message.reply_text("FOMO mode not activated yet. Try again later.")
            return
            
        # Create keyboard with buy/sell button and delete button
        keyboard = [
            [InlineKeyboardButton("🚀 Buy High, Sell Low", url="https://t.me/tonnel_network_bot/gifts?startapp=ref_7660176383")],
            [InlineKeyboardButton("🔥 To The Moon!", url="https://t.me/tonnel_network_bot/gifts?startapp=ref_7660176383")],
            [InlineKeyboardButton("🗑️ Delete", callback_data="delete")]
        ]
        
        # Send the FOMO card
        with open(fomo_card_path, 'rb') as photo:
            sent_message = await update.message.reply_photo(
                photo=photo,
                caption="💎 <b>FOMO</b> 💎\n\n69 TON = $69 USD (+420%)\n\n🚀 Number go up! 🚀",
                parse_mode=ParseMode.HTML,
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
            
            # Register the message owner in the database for delete permission tracking
            try:
                from rate_limiter import register_message
                user_id = update.effective_user.id
                chat_id = update.effective_chat.id
                register_message(user_id, chat_id, sent_message.message_id)
                logging.info(f"Registered FOMO message {sent_message.message_id} to user {user_id}")
            except ImportError:
                logging.warning("Rate limiter not available, message ownership not registered")
            except Exception as e:
                logging.error(f"Error registering message ownership: {e}")
            
    except Exception as e:
        logger.error(f"Error handling FOMO Easter egg: {e}")
        await update.message.reply_text("Failed to activate FOMO mode. Please try again later.")

# After the handle_fomo_easter_egg function, add a new function for Samir Easter egg
async def handle_samir_easter_egg(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle the Samir Samkara Easter egg when a user types 'samir samkara' or 'سمير سمكره'"""
    try:
        # Path for the Samir card
        samir_card_path = os.path.join(GIFT_CARDS_DIR, "SAMIR_card.png")
        
        # Check if the card exists
        if not os.path.exists(samir_card_path):
            logger.error(f"Samir card not found at {samir_card_path}")
            await update.message.reply_text("Samir is busy fixing cars. Try again later.")
            return
            
        # Create keyboard with buy/sell button and delete button
        keyboard = [
            [InlineKeyboardButton("📉 Buy Low, Sell Lower", url="https://t.me/tonnel_network_bot/gifts?startapp=ref_7660176383")],
            [InlineKeyboardButton("💩 Crash to Zero", url="https://t.me/tonnel_network_bot/gifts?startapp=ref_7660176383")],
            [InlineKeyboardButton("🗑️ Delete", callback_data="delete")]
        ]
        
        # Send the Samir card
        with open(samir_card_path, 'rb') as photo:
            sent_message = await update.message.reply_photo(
                photo=photo,
                caption="💎 <b>SAMIR SAMKARA</b> 💎\n\n-9999 TON = $-9999 USD (-99.9%)\n\n📉 Number only go down! 📉",
                parse_mode=ParseMode.HTML,
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
            
            # Register the message owner in the database for delete permission tracking
            try:
                from rate_limiter import register_message
                user_id = update.effective_user.id
                chat_id = update.effective_chat.id
                register_message(user_id, chat_id, sent_message.message_id)
                logging.info(f"Registered SAMIR message {sent_message.message_id} to user {user_id}")
            except ImportError:
                logging.warning("Rate limiter not available, message ownership not registered")
            except Exception as e:
                logging.error(f"Error registering message ownership: {e}")
            
    except Exception as e:
        logger.error(f"Error handling Samir Easter egg: {e}")
        await update.message.reply_text("Samir crashed the car again. Please try later.")

# Add a new function for the Zeus Easter egg
async def handle_zeus_easter_egg(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle the Zeus Easter egg when a user types '@Zeuuus005'"""
    
    # Path for the Zeus card
    zeus_card_path = os.path.join(GIFT_CARDS_DIR, "ZEUS_card.png")
    
    # Generate the card if it doesn't exist
    if not os.path.exists(zeus_card_path):
        logger.error(f"Zeus card not found at {zeus_card_path}")
        await update.message.reply_text("يا عبيط mode not activated yet. Try again later.")
        return
        
        # Note: The zeus_card_path should be generated by running create_zeus_card.py
        # It's not being generated here to avoid import conflicts
        
    try:
        # Send the Zeus card
        with open(zeus_card_path, 'rb') as photo:
            keyboard = [[
                InlineKeyboardButton("🗑️ Delete", callback_data="delete")
            ]]
            
            sent_message = await update.message.reply_photo(
                photo=photo,
                caption="💎 <b>يا عبيط</b> 💎\n\n5 TON = $5 USD (-50%)\n\n📊 Number very crazy! 📊",
                parse_mode=ParseMode.HTML,
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
            
            # Register the message owner in the database for delete permission tracking
            try:
                from rate_limiter import register_message
                user_id = update.effective_user.id
                chat_id = update.effective_chat.id
                register_message(user_id, chat_id, sent_message.message_id)
                logging.info(f"Registered ZEUS message {sent_message.message_id} to user {user_id}")
            except ImportError:
                logging.warning("Rate limiter not available, message ownership not registered")
            except Exception as e:
                logging.error(f"Error registering message ownership: {e}")
            
    except Exception as e:
        logger.error(f"Error handling Zeus Easter egg: {e}")
        await update.message.reply_text("Failed to activate يا عبيط mode. Please try again later.")

# Update the handle_message function to check for FOMO, Samir and Zeus keywords
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle incoming messages."""
    # Skip processing for non-text messages
    if not update.message or not update.message.text:
        return
    
    # Get message text
    message_text = update.message.text.strip().lower()
    
    # Check for FOMO Easter egg
    if message_text == "fomo" or message_text == "فوموا":
        await handle_fomo_easter_egg(update, context)
        return
        
    # Check for Samir Easter egg
    if message_text == "samir samkara" or message_text == "سمير سمكره" or message_text == "smair samkara":
        await handle_samir_easter_egg(update, context)
        return
        
    # Check for Zeus Easter egg
    if message_text == "@zeuuus005":
        await handle_zeus_easter_egg(update, context)
        return
    
    # Handle commands with slash separately
    if message_text.startswith('/'):
        # This is a command, ignore it as it will be handled by command handlers
        return
    
    # Skip if message is empty
    if not message_text:
        return
    
    # Ignore messages that are results of inline mode (via @bot)
    if update.message.via_bot:
        return
        
    # Ignore messages that appear to be from inline results or contain diamond emoji
    if "💎" in message_text or "TON =" in message_text:
        return
    
    # Get user and chat info for rate limiting
    user_id = update.effective_user.id
    chat_id = update.effective_chat.id
    
    # Check if this is a command from inline mode
    if message_text.startswith("/gift_"):
        # Extract gift name from command
        gift_name = message_text[6:].replace("_", " ")
        
        # Apply rate limiting for specific gift
        try:
            from rate_limiter import can_user_request
            can_request, seconds_remaining = can_user_request(user_id, chat_id, gift_name)
            
            if not can_request:
                # User is rate limited for this gift
                if seconds_remaining > 0:
                    # Only notify in private chats or when mentioned to avoid spam
                    is_private = update.message.chat.type == "private"
                    is_mentioned = False
                    
                    if is_private:
                        await update.message.reply_text(
                            f"⏱️ You can request each gift once per minute. Please wait {seconds_remaining} seconds to request {gift_name} again.",
                            reply_to_message_id=update.message.message_id
                        )
                return
        except ImportError:
            # Rate limiter not available, continue without rate limiting
            logger.warning("Rate limiter not available, continuing without rate limiting")
        
        # Send the gift card
        await send_gift_card(update, context, gift_name)
        return
    
    # Check if this is a private chat or if the bot is mentioned in a group
    is_private = update.message.chat.type == "private"
    is_mentioned = False
    
    # Check if bot is mentioned in the message
    if update.message.entities:
        for entity in update.message.entities:
            if entity.type == "mention":
                # Extract the mention
                mention = message_text[entity.offset:entity.offset + entity.length]
                # Check if it's the bot's username
                if mention.lower() == BOT_USERNAME.lower():
                    is_mentioned = True
                    # Remove the mention from the message
                    message_text = message_text.replace(mention, "").strip()
    
    # Only process if in private chat, bot is mentioned, or RESPOND_TO_ALL_MESSAGES is True
    if not is_private and not is_mentioned and not RESPOND_TO_ALL_MESSAGES:
        return
    
    # Only skip very obvious greetings in group chats
    very_common_greetings = ["hi", "hello", "hey", "thanks", "thank you"]
    if not is_private and message_text.lower() in very_common_greetings:
        return
    
    # Use the enhanced matching function
    matching_gifts = find_matching_gifts(message_text)
    
    if matching_gifts:
        # Check if this is a gift group (like "Ring", "Hat", etc.)
        gift_groups = {
            "ring": "Rings", 
            "hat": "Hats",
            "heart": "Hearts",
            "candle": "Candles",
            "snake": "Snakes",
            "box": "Boxes",
            "bunny": "Bunnies",
            "signet": "Signets",
            "potion": "Potions",
            "bell": "Bells"
        }
        
        is_group = False
        group_name = ""
        for group, display_name in gift_groups.items():
            if message_text.lower() == group:
                is_group = True
                group_name = display_name
                break
        
        if is_group:
            # This is a gift group, show a special selection message
            keyboard = []
            row = []
            for i, name in enumerate(matching_gifts[:8]):  # Limit to 8 results
                row.append(InlineKeyboardButton(name, callback_data=f"gift_{name}"))
                if i % 2 == 1 or i == len(matching_gifts[:8]) - 1:
                    keyboard.append(row)
                    row = []
            
            # No delete button for selection menus per user request
            
            reply_markup = InlineKeyboardMarkup(keyboard)
            sent_message = await update.message.reply_text(
                f"🔁 Here are all the {group_name} gifts available:",
                reply_markup=reply_markup
            )
            
            # Register the message owner in the database for delete permission tracking
            try:
                from rate_limiter import register_message
                register_message(user_id, chat_id, sent_message.message_id)
                logging.info(f"Registered gift group message {sent_message.message_id} to user {user_id}")
            except ImportError:
                logging.warning("Rate limiter not available, message ownership not registered")
            except Exception as e:
                logging.error(f"Error registering message ownership: {e}")
            
            return
        elif len(matching_gifts) == 1:
            # Exact match found
            gift_name = matching_gifts[0]
            
            # Apply rate limiting for specific gift
            try:
                from rate_limiter import can_user_request
                can_request, seconds_remaining = can_user_request(user_id, chat_id, gift_name)
                
                if not can_request:
                    # User is rate limited for this gift
                    if seconds_remaining > 0:
                        # Only notify in private chats or when mentioned to avoid spam
                        is_private = update.message.chat.type == "private"
                        is_mentioned = False
                        
                        if is_private or is_mentioned:
                            await update.message.reply_text(
                                f"⏱️ You can request each gift once per minute. Please wait {seconds_remaining} seconds to request {gift_name} again.",
                                reply_to_message_id=update.message.message_id
                            )
                    return
            except ImportError:
                # Rate limiter not available, continue without rate limiting
                logger.warning("Rate limiter not available, continuing without rate limiting")
            
            await send_gift_card(update, context, gift_name)
            return
        elif len(matching_gifts) > 1:
            # Multiple matches found - ensure no duplicates
            unique_gifts = list(dict.fromkeys(matching_gifts))
            
            # Build keyboard with unique gifts
            keyboard = []
            row = []
            for i, name in enumerate(unique_gifts[:8]):  # Limit to 8 results
                row.append(InlineKeyboardButton(name, callback_data=f"gift_{name}"))
                if i % 2 == 1 or i == len(unique_gifts[:8]) - 1:
                    keyboard.append(row)
                    row = []
            
            # No delete button for selection menus per user request
            
            reply_markup = InlineKeyboardMarkup(keyboard)
            sent_message = await update.message.reply_text(
                f"🔁 Here are all the {group_name} gifts available:",
                reply_markup=reply_markup
            )
            
            # Register the message owner in the database for delete permission tracking
            try:
                from rate_limiter import register_message
                register_message(user_id, chat_id, sent_message.message_id)
                logging.info(f"Registered gift group message {sent_message.message_id} to user {user_id}")
            except ImportError:
                logging.warning("Rate limiter not available, message ownership not registered")
            except Exception as e:
                logging.error(f"Error registering message ownership: {e}")
            
            return
    
    # Only show the default message in private chats or when directly mentioned
    if is_private or is_mentioned:
        await update.message.reply_text(
            "I can show you Telegram gift prices. Use /gift to browse categories, /search to find a specific gift, or /help for more commands."
        )

# Dictionary to cache uploaded photos (gift_name -> file_id)
photo_cache = {}

# Helper function to ensure a card is generated and uploaded
async def ensure_uploaded_card(context, gift_name):
    """Ensure a gift card is generated and uploaded to Telegram servers."""
    global photo_cache
    
    # Check if we already have the file_id cached
    if gift_name in photo_cache:
        return photo_cache[gift_name]
    
    # Generate the card
    card_path = generate_gift_card(gift_name)
    
    if card_path and os.path.exists(card_path):
        try:
            # Upload the photo to Telegram servers
            with open(card_path, 'rb') as photo_file:
                message = await context.bot.send_photo(
                    chat_id=context.bot.id,  # Send to the bot itself
                    photo=photo_file,
                    caption=f"🎁 {gift_name} (Cached for inline mode)"
                )
                
                # Get the file_id from the uploaded photo
                file_id = message.photo[-1].file_id
                
                # Cache the file_id for future use
                photo_cache[gift_name] = file_id
                
                return file_id
        except Exception as e:
            logging.error(f"Error uploading card for {gift_name}: {e}")
            return None
    
    return None

def main() -> None:
    """Start the bot."""
    # Initialize rate limiter database
    try:
        from rate_limiter import ensure_tables_exist
        ensure_tables_exist()
        logger.info("Database tables verified or created")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
    
    # Create the Application and pass it your bot's token
    # Determine the connection method based on configuration
    connection_pool_size = 8  # Use larger pool for better performance
    http_version = "2"  # Use HTTP/2 for better performance
    connect_timeout = 30.0  # Longer timeout for more stable connections
    read_timeout = 30.0  # Longer timeout for more stable connections
    write_timeout = 30.0  # Longer timeout for more stable connections
    
    # Create the Application and pass it your bot's token.
    token = BOT_TOKEN
    
    # Add network connectivity check
    try:
        # Test connection to Telegram API
        host = "api.telegram.org"
        socket.create_connection((host, 443), timeout=5)
        logger.info("Network connection to Telegram API is available")
    except OSError as e:
        logger.error(f"Network connectivity issue: {e}")
        logger.error("Cannot connect to Telegram API. Please check your internet connection.")
        print("ERROR: Cannot connect to Telegram API. Please check your internet connection.")
        return
    
    # Check if bot token is valid format
    if not token or token == "YOUR_TOKEN_HERE" or len(token.split(":")) != 2:
        logger.error("Invalid bot token. Please check your bot_config.py file.")
        print("ERROR: Invalid bot token. Please check your bot_config.py file.")
        return
    
    # Build the application with base settings
    builder = Application.builder().token(token).pool_timeout(30.0).connection_pool_size(8)
    
    # Build the application
    application = builder.build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("gift", gift_command))
    application.add_handler(CommandHandler("random", random_command))
    application.add_handler(CommandHandler("search", search_command))
    application.add_handler(CommandHandler("price", handle_price_command))
    application.add_handler(CommandHandler("g", handle_gift_command))
    
    # Inline mode handler
    application.add_handler(InlineQueryHandler(inline_query))
    
    # Callback query handler
    application.add_handler(CallbackQueryHandler(callback_handler))
    
    # Add message handler (must be last)
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Start the Bot with error handling
    try:
        logger.info("Starting bot...")
        application.run_polling(allowed_updates=Update.ALL_TYPES)
    except NetworkError as e:
        logger.error(f"Network error: {e}")
        print(f"Network error: {e}")
        print("Please check your internet connection and try again later.")
    except ConnectError as e:
        logger.error(f"Connection error: {e}")
        print(f"Connection error: {e}")
        print("Cannot connect to Telegram servers. Please check your internet connection.")
    except ProxyError as e:
        logger.error(f"Proxy error: {e}")
        print(f"Proxy error: {e}")
        print("There was an error with your proxy configuration.")
    except Exception as e:
        logger.error(f"Error running bot: {e}")
        print(f"Error running bot: {e}")
        print("Please check the logs for details.")

if __name__ == "__main__":
    main() 