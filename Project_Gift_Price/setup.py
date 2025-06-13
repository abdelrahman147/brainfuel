#!/usr/bin/env python3
import os
import sys
import subprocess
import webbrowser

def print_header(title):
    """Print a formatted header"""
    print("\n" + "=" * 60)
    print(f" {title} ".center(60, "="))
    print("=" * 60 + "\n")

def setup_catbox():
    """Set up catbox.moe for image hosting"""
    print_header("CATBOX.MOE SETUP")
    
    print("This will set up catbox.moe to host your gift card images.\n")
    print("No additional setup is required as catbox.moe is free to use without registration.")
    print("Images will be uploaded to https://catbox.moe/ automatically.")
    
    # Test image uploader
    try:
        subprocess.run([sys.executable, "image_uploader.py"], check=True)
        return True
    except subprocess.CalledProcessError:
        print("\nError testing image uploader. Please check image_uploader.py.")
        return False

def setup_telegram_bot():
    """Configure the Telegram bot"""
    print_header("TELEGRAM BOT SETUP")
    
    print("Let's configure your Telegram bot.\n")
    
    # Check if bot_config.py exists
    if os.path.exists("bot_config.py"):
        overwrite = input("bot_config.py already exists. Do you want to update it? (y/n): ").lower()
        if overwrite != 'y':
            print("Skipping bot configuration.")
            return True
    
    # Get bot token
    print("\nYou need your Telegram bot token from @BotFather.")
    print("If you don't have one yet, you can create a new bot:")
    input("Press Enter to open BotFather in Telegram... ")
    webbrowser.open("https://t.me/botfather")
    
    bot_token = input("\nEnter your bot token (from @BotFather): ").strip()
    if not bot_token:
        print("No token provided. Using existing token or environment variable.")
        return False
    
    # Get bot username
    bot_username = input("Enter your bot username (e.g., @YourBot): ").strip()
    if not bot_username.startswith('@'):
        bot_username = f"@{bot_username}"
    
    # Create or update bot_config.py
    with open("bot_config.py", "w") as f:
        f.write(f'# Telegram Bot Configuration\n')
        f.write(f'BOT_TOKEN = "{bot_token}"\n')
        f.write(f'BOT_USERNAME = "{bot_username}"\n')
        f.write(f'RESPOND_TO_ALL_MESSAGES = True\n')
    
    print("\nBot configuration saved to bot_config.py")
    return True



def main():
    """Main setup function"""
    print_header("TELEGRAM GIFT BOT SETUP")
    print("This script will help you set up the Telegram Gift Bot with")
    print("catbox.moe for image hosting.\n")
    
    # Setup steps
    steps = [
        ("Set up catbox.moe for image hosting", setup_catbox),
        ("Configure the Telegram bot", setup_telegram_bot)
    ]
    
    for i, (step_name, step_func) in enumerate(steps, 1):
        print(f"\nStep {i}/{len(steps)}: {step_name}")
        
        # Ask the user if they want to perform this step
        proceed = input(f"Do you want to perform this step? (y/n): ").lower()
        if proceed == 'y':
            success = step_func()
            if not success:
                print(f"\nFailed to complete step {i}: {step_name}")
                print("You can run this setup again to retry.")
                should_continue = input("Do you want to continue with the next steps? (y/n): ").lower()
                if should_continue != 'y':
                    return
        else:
            print(f"Skipping step {i}: {step_name}")
    
    print_header("SETUP COMPLETE")
    print("Your Telegram Gift Bot is now set up with catbox.moe image hosting!")
    print("\nTo start the bot, run:")
    print("python telegram_bot.py")
    
    # Ask if they want to start the bot now
    start_now = input("\nDo you want to start the bot now? (y/n): ").lower()
    if start_now == 'y':
        print("\nStarting the bot...")
        subprocess.Popen([sys.executable, "telegram_bot.py"])
        print("\nBot is running! Press Ctrl+C in the terminal to stop it.")
    else:
        print("\nYou can start the bot later by running 'python telegram_bot.py'")

if __name__ == "__main__":
    main() 