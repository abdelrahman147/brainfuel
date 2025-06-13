#!/usr/bin/env python3
import os
import sys

def setup_bot():
    print("===== Telegram Gift Price Bot Setup =====")
    print("This script will help you configure your Telegram bot.")
    print()
    
    # Check if bot_config.py already exists
    if os.path.exists("bot_config.py"):
        with open("bot_config.py", "r") as f:
            config_content = f.read()
        
        # Extract current values if they exist
        current_token = None
        current_username = None
        
        for line in config_content.split("\n"):
            if "BOT_TOKEN =" in line:
                current_token = line.split("=")[1].strip().strip('"\'')
                if current_token == "YOUR_BOT_TOKEN_HERE":
                    current_token = None
            
            if "BOT_USERNAME =" in line:
                current_username = line.split("=")[1].strip().strip('"\'')
                if current_username == "@YourBotUsername":
                    current_username = None
        
        print("Existing configuration found.")
        if current_token and current_token != "YOUR_BOT_TOKEN_HERE":
            print(f"Current bot token: {current_token[:5]}...{current_token[-5:]}")
        if current_username and current_username != "@YourBotUsername":
            print(f"Current bot username: {current_username}")
        print()
    
    # Get bot token
    token = input("Enter your Telegram bot token (from BotFather): ").strip()
    if not token:
        print("Error: Bot token is required.")
        return False
    
    # Get bot username
    username = input("Enter your bot's username (with @ prefix, e.g. @MyGiftBot): ").strip()
    if not username:
        print("Error: Bot username is required.")
        return False
    
    if not username.startswith("@"):
        username = "@" + username
    
    # Ask about group chat behavior
    respond_to_all = input("Should the bot respond to all messages in group chats? (yes/no, default: no): ").strip().lower()
    respond_to_all = respond_to_all in ["yes", "y", "true", "1"]
    
    # Create or update config file
    with open("bot_config.py", "w") as f:
        f.write("# Telegram Bot Configuration\n\n")
        f.write(f"# Your bot token from BotFather\n")
        f.write(f'BOT_TOKEN = "{token}"\n\n')
        f.write(f"# Your bot username (with @ prefix)\n")
        f.write(f'BOT_USERNAME = "{username}"\n\n')
        f.write(f"# Set this to True to have the bot respond to all messages in group chats\n")
        f.write(f"# Set to False to only respond when mentioned or in private chats\n")
        f.write(f"RESPOND_TO_ALL_MESSAGES = {str(respond_to_all)}")
    
    print("\nConfiguration saved to bot_config.py")
    print("\nTo start your bot, run:")
    print("python telegram_bot.py")
    
    # Ask if they want to run the bot now
    run_now = input("\nDo you want to start the bot now? (yes/no): ").strip().lower()
    if run_now in ["yes", "y", "true", "1"]:
        print("\nStarting bot...")
        try:
            import telegram_bot
            telegram_bot.main()
        except Exception as e:
            print(f"Error starting bot: {e}")
            return False
    
    return True

if __name__ == "__main__":
    setup_bot() 