import os
import sys
import requests
import time
from PIL import Image
import re
import json
import logging
from difflib import get_close_matches
from telegram_bot import find_matching_gifts

# Set up logging for main.py
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("main")

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Create directories if they don't exist
os.makedirs(os.path.join(script_dir, "downloaded_images"), exist_ok=True)

# List of all available gift names
names = [
    "Plush Pepe", "Heart Locket", "Durov's Cap", "Precious Peach", "Heroic Helmet",
    "Pony Sparkles", "Tuna Can", "Ice Cream", "Fries", "Burger",
    "Bouquet", "Cake", "Balloon", "Teddy Bear", "Dice",
    "Football", "Basketball", "Tennis Ball", "Bowling Ball", "Dart",
    "Rose", "Tulip", "Cactus", "Sunflower", "Bonsai",
    "Puppy", "Kitten", "Panda", "Penguin", "Koala",
    "Unicorn", "Dragon", "Phoenix", "Griffin", "Pegasus",
    "Diamond", "Ruby", "Emerald", "Sapphire", "Amethyst",
    "Crown", "Tiara", "Ring", "Necklace", "Bracelet",
    "Sword", "Shield", "Axe", "Bow", "Arrow",
    "Wand", "Staff", "Orb", "Potion", "Scroll",
    "Book", "Quill", "Inkwell", "Map", "Compass",
    "Jack-in-the-Box", "Yo-yo", "Spinning Top", "Kite", "Pinwheel",
    "Drum", "Guitar", "Piano", "Trumpet", "Violin",
    "Telescope", "Microscope", "Magnifying Glass", "Hourglass", "Clock",
    "Rocket", "UFO", "Satellite", "Spaceship", "Robot",
    "Mermaid", "Wizard", "Fairy", "Elf", "Dwarf",
    "Zombie", "Ghost", "Vampire", "Werewolf", "Witch"
]

# Function to download an image from a URL
def download_image(url, filepath, max_retries=3, retry_delay=2):
    """
    Download an image from a URL and save it to a file.
    
    Args:
        url: URL of the image to download
        filepath: Path to save the image to
        max_retries: Maximum number of retry attempts
        retry_delay: Delay between retry attempts in seconds
        
    Returns:
        bool: True if download was successful, False otherwise
    """
    for attempt in range(max_retries):
        try:
            # Import API configuration for timeout
            try:
                from api_config import REQUEST_TIMEOUT
            except ImportError:
                REQUEST_TIMEOUT = 30
                
            response = requests.get(url, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()  # Raise exception for 4XX/5XX responses
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
                
            # Verify the downloaded file is a valid image
            try:
                img = Image.open(filepath)
                img.verify()  # Verify it's an image
                return True
            except Exception as e:
                print(f"Downloaded file is not a valid image: {e}")
                if os.path.exists(filepath):
                    os.remove(filepath)
                # Continue to retry
        
        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt+1}/{max_retries} failed: {e}")
            
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print(f"Failed to download image after {max_retries} attempts")
                return False
    
    return False

# Function to normalize gift names for file paths
def normalize_gift_name(gift_name):
    """
    Normalize a gift name for use in file paths.
    
    Args:
        gift_name: Name of the gift
        
    Returns:
        str: Normalized name
    """
    if gift_name == "Jack-in-the-Box":
        return "Jack_in_the_Box"
    elif gift_name == "Durov's Cap":
        return "Durovs_Cap"
    else:
        return gift_name.replace(" ", "_").replace("-", "_").replace("'", "")

# Function to create a mapping of simplified names to actual names
def create_name_mapping():
    """
    Create a mapping of simplified names to actual names.
    
    Returns:
        dict: Mapping of simplified names to actual names
    """
    mapping = {}
    for name in names:
        # Create simplified versions of the name
        simple_name = name.lower()
        simple_name = simple_name.replace("-", "")
        simple_name = simple_name.replace("'", "")
        simple_name = simple_name.replace(" ", "")
        
        # Add to mapping
        mapping[simple_name] = name
    
    return mapping

# Download all gift images
def download_all_gift_images():
    """
    Download images for all gifts in the names list.
    
    Returns:
        int: Number of successfully downloaded images
    """
    success_count = 0
    for gift_name in names:
        normalized_name = normalize_gift_name(gift_name)
        url = f"https://raw.githubusercontent.com/YUST777/telegram-gifts/main/images/{normalized_name}.png"
        filepath = os.path.join(script_dir, "downloaded_images", f"{normalized_name}.png")
        
        # Skip if file already exists
        if os.path.exists(filepath):
            print(f"Image for {gift_name} already exists, skipping download")
            success_count += 1
            continue
        
        print(f"Downloading image for {gift_name}...")
        if download_image(url, filepath):
            print(f"Successfully downloaded image for {gift_name}")
            success_count += 1
        else:
            print(f"Failed to download image for {gift_name}")
    
    return success_count

# Main function
def main():
    """Main function to download all gift images."""
    print(f"Downloading images for {len(names)} gifts...")
    success_count = download_all_gift_images()
    print(f"Successfully downloaded {success_count} out of {len(names)} gift images")
    
    # Create name mapping
    mapping = create_name_mapping()
    print(f"Created mapping for {len(mapping)} simplified names")

# Run the main function if this script is run directly
if __name__ == "__main__":
    main()
