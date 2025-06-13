#!/usr/bin/env python3
import os
import sys
import time
import datetime
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("pregenerate_cards.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("pregenerate_cards")

# Add parent directory to path to import new_card_design
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import new_card_design

# Path for the output cards
GIFT_CARDS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "new_gift_cards")
os.makedirs(GIFT_CARDS_DIR, exist_ok=True)

# Path for tracking the last generation time
TIMESTAMP_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "last_generation_time.txt")

def get_available_gift_names():
    """Get a list of all available gift names from main.py"""
    try:
        # Try to import the official list of gift names from main.py
        try:
            from main import names
            logger.info(f"Using official list of {len(names)} gift names from main.py")
            return names
        except ImportError:
            logger.warning("Could not import names from main.py, falling back to directory scan")
            
            # Fallback: Get the directory where the script is located
            script_dir = os.path.dirname(os.path.abspath(__file__))
            
            # Path to the downloaded images
            images_dir = os.path.join(script_dir, "downloaded_images")
            
            # Check if directory exists
            if not os.path.exists(images_dir):
                logger.error(f"Downloaded images directory not found: {images_dir}")
                os.makedirs(images_dir, exist_ok=True)
                return []
            
            # Get all PNG files
            gift_files = [f for f in os.listdir(images_dir) if f.endswith('.png')]
            
            # Extract gift names from filenames, skipping known duplicates and special files
            gift_names = []
            skip_files = ["SAMIR.png", "smair.png", "FOMO.png", "ZEUS.png"]
            
            for filename in gift_files:
                # Skip known duplicates and special files
                if filename in skip_files:
                    continue
                    
                # Remove extension and replace underscores with spaces
                gift_name = os.path.splitext(filename)[0].replace('_', ' ')
                # Handle special cases
                if gift_name == "Jack in the Box":
                    gift_name = "Jack-in-the-Box"
                elif gift_name == "Durovs Cap":
                    gift_name = "Durov's Cap"
                
                # Avoid duplicates
                if gift_name not in gift_names:
                    gift_names.append(gift_name)
            
            return gift_names
    except Exception as e:
        logger.error(f"Error getting available gift names: {e}")
        return []

def generate_card(gift_name):
    """Generate a single gift card"""
    try:
        logger.info(f"Generating card for {gift_name}...")
        output_path = new_card_design.generate_specific_gift(gift_name)
        if output_path:
            logger.info(f"Successfully generated card for {gift_name} at {output_path}")
            return True
        else:
            logger.error(f"Failed to generate card for {gift_name}")
            return False
    except Exception as e:
        logger.error(f"Error generating card for {gift_name}: {e}")
        return False

def generate_all_cards():
    """Generate all gift cards in parallel"""
    start_time = time.time()
    logger.info("Starting batch card generation...")
    
    # Get all available gift names
    gift_names = get_available_gift_names()
    logger.info(f"Found {len(gift_names)} gifts to process")
    
    # Skip if no gift names found
    if not gift_names:
        logger.warning("No gift names found, skipping generation")
        return 0, 0, 0
    
    # Track successful and failed generations
    successful = 0
    failed = 0
    
    # Use ThreadPoolExecutor to generate cards in parallel
    with ThreadPoolExecutor(max_workers=4) as executor:
        # Submit all tasks
        future_to_gift = {executor.submit(generate_card, gift_name): gift_name for gift_name in gift_names}
        
        # Process results as they complete
        for future in as_completed(future_to_gift):
            gift_name = future_to_gift[future]
            try:
                result = future.result()
                if result:
                    successful += 1
                else:
                    failed += 1
            except Exception as e:
                logger.error(f"Exception processing {gift_name}: {e}")
                failed += 1
    
    # Calculate elapsed time
    elapsed_time = time.time() - start_time
    logger.info(f"Batch generation completed in {elapsed_time:.2f} seconds")
    logger.info(f"Successfully generated {successful} cards, failed: {failed}")
    
    # Update the timestamp file
    with open(TIMESTAMP_FILE, 'w') as f:
        f.write(str(int(time.time())))
    
    return successful, failed, elapsed_time

def should_regenerate():
    """Check if we should regenerate cards based on the timestamp file"""
    try:
        if not os.path.exists(TIMESTAMP_FILE):
            logger.info("No timestamp file found, will generate cards")
            return True
        
        with open(TIMESTAMP_FILE, 'r') as f:
            last_time = int(f.read().strip())
        
        current_time = int(time.time())
        
        # Check if either timestamp is in the future (system clock issue)
        current_year = datetime.datetime.fromtimestamp(current_time).year
        last_year = datetime.datetime.fromtimestamp(last_time).year
        
        if current_year > 2024 or last_year > 2024:
            logger.warning("Detected future date timestamp - forcing regeneration")
            return True
            
        elapsed_minutes = (current_time - last_time) / 60
        
        # Regenerate if more than 32 minutes have passed
        if elapsed_minutes >= 32:
            logger.info(f"Last generation was {elapsed_minutes:.1f} minutes ago, will regenerate")
            return True
        else:
            logger.info(f"Last generation was {elapsed_minutes:.1f} minutes ago, skipping")
            return False
    except Exception as e:
        logger.error(f"Error checking regeneration time: {e}")
        # If there's an error reading the timestamp, regenerate to be safe
        return True

def generate_easter_egg(module_name, card_name):
    """Generate a single Easter egg card safely"""
    try:
        logger.info(f"Generating {card_name} Easter egg card...")
        module = __import__(module_name)
        return True
    except ImportError:
        logger.error(f"Could not import {module_name}: Easter egg module not found")
        return False
    except Exception as e:
        logger.error(f"Error generating {card_name} Easter egg card: {e}")
        return False

def main():
    try:
        # Check if we should regenerate
        if should_regenerate():
            # Generate all cards
            successful, failed, elapsed_time = generate_all_cards()
            
            # Generate special Easter egg cards
            try:
                logger.info("Generating Easter egg cards...")
                
                # Import and run the Easter egg card generators
                easter_eggs = [
                    ("create_samir_card", "SAMIR"),
                    ("create_fomo_card", "FOMO"),
                    ("create_zeus_card", "ZEUS")
                ]
                
                for module_name, card_name in easter_eggs:
                    generate_easter_egg(module_name, card_name)
                
                logger.info("Easter egg cards generation complete")
            except Exception as e:
                logger.error(f"Error in Easter egg generation wrapper: {e}")
            
            if successful > 0:
                logger.info(f"All done! Generated {successful} cards in {elapsed_time:.2f} seconds")
            else:
                logger.warning("No cards were successfully generated")
        else:
            logger.info("Skipping generation as cards are still fresh")
    except Exception as e:
        logger.error(f"Error in main function: {e}")

if __name__ == "__main__":
    main() 