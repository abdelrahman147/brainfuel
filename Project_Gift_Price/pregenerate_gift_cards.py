#!/usr/bin/env python3
import os
import sys
import time
import json
import logging
import concurrent.futures
from datetime import datetime, timedelta

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Add the script directory to the Python path
sys.path.insert(0, script_dir)

# Import the card generation module
from new_card_design import create_gift_card, names

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(script_dir, "pregeneration.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# File to store the timestamp of the last pregeneration
TIMESTAMP_FILE = os.path.join(script_dir, "last_pregeneration.txt")

# Directory for gift cards
GIFT_CARDS_DIR = os.path.join(script_dir, "new_gift_cards")
os.makedirs(GIFT_CARDS_DIR, exist_ok=True)

def generate_card_for_gift(gift_name):
    """Generate a card for a specific gift"""
    try:
        # Normalize gift name for file paths
        if gift_name == "Jack-in-the-Box":
            normalized_name = "Jack_in_the_Box"
        elif gift_name == "Durov's Cap":
            normalized_name = "Durovs_Cap"
        else:
            normalized_name = gift_name.replace(" ", "_").replace("-", "_").replace("'", "")
        
        # Output path for the card
        output_path = os.path.join(GIFT_CARDS_DIR, f"{normalized_name}_card.png")
        
        # Check if the card already exists
        if os.path.exists(output_path):
            # Get file modification time
            mod_time = os.path.getmtime(output_path)
            now = time.time()
            
            # If the card was generated less than 1 hour ago, skip it
            if now - mod_time < 3600:  # 3600 seconds = 1 hour
                logger.info(f"Card for {gift_name} is recent, skipping")
                return True
        
        # Generate the card
        logger.info(f"Generating card for {gift_name}...")
        create_gift_card(gift_name, output_path)
        logger.info(f"Card generated for {gift_name}")
        return True
    except Exception as e:
        logger.error(f"Error generating card for {gift_name}: {e}")
        return False

def pregenerate_all_cards():
    """Pregenerate cards for all gifts using parallel processing"""
    logger.info("Starting card pregeneration...")
    
    # Count total gifts
    total_gifts = len(names)
    logger.info(f"Pregenerating cards for {total_gifts} gifts")
    
    # Use a ThreadPoolExecutor for parallel processing
    # Use max_workers based on CPU count but limit to avoid overloading
    max_workers = min(os.cpu_count() or 4, 8)
    logger.info(f"Using {max_workers} workers for parallel processing")
    
    success_count = 0
    failed_gifts = []
    
    start_time = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks and store futures
        future_to_gift = {executor.submit(generate_card_for_gift, gift_name): gift_name for gift_name in names}
        
        # Process results as they complete
        for future in concurrent.futures.as_completed(future_to_gift):
            gift_name = future_to_gift[future]
            try:
                success = future.result()
                if success:
                    success_count += 1
                else:
                    failed_gifts.append(gift_name)
            except Exception as e:
                logger.error(f"Exception for {gift_name}: {e}")
                failed_gifts.append(gift_name)
    
    end_time = time.time()
    duration = end_time - start_time
    
    logger.info(f"Card pregeneration complete. Generated {success_count} out of {total_gifts} cards in {duration:.2f} seconds")
    
    if failed_gifts:
        logger.warning(f"Failed to generate cards for {len(failed_gifts)} gifts: {', '.join(failed_gifts)}")
    
    # Update the timestamp file
    with open(TIMESTAMP_FILE, 'w') as f:
        f.write(str(int(time.time())))
    
    return success_count

def should_pregenerate():
    """Check if we should pregenerate cards based on the last pregeneration time"""
    try:
        # Check if the timestamp file exists
        if not os.path.exists(TIMESTAMP_FILE):
            logger.info("No previous pregeneration timestamp found, should pregenerate")
            return True
        
        # Read the last pregeneration timestamp
        with open(TIMESTAMP_FILE, 'r') as f:
            last_time = int(f.read().strip())
        
        # Get current time
        current_time = int(time.time())
        
        # Check if it's been more than 6 hours since the last pregeneration
        if current_time - last_time > 6 * 3600:  # 6 hours in seconds
            logger.info("More than 6 hours since last pregeneration, should pregenerate")
            return True
        
        # Check if any cards are missing
        for gift_name in names:
            # Normalize gift name for file paths
            if gift_name == "Jack-in-the-Box":
                normalized_name = "Jack_in_the_Box"
            elif gift_name == "Durov's Cap":
                normalized_name = "Durovs_Cap"
            else:
                normalized_name = gift_name.replace(" ", "_").replace("-", "_").replace("'", "")
            
            # Check if the card exists
            card_path = os.path.join(GIFT_CARDS_DIR, f"{normalized_name}_card.png")
            if not os.path.exists(card_path):
                logger.info(f"Card for {gift_name} is missing, should pregenerate")
                return True
        
        logger.info("No need to pregenerate cards at this time")
        return False
    except Exception as e:
        logger.error(f"Error checking if should pregenerate: {e}")
        # If there's an error, pregenerate to be safe
        return True

def main():
    """Main function"""
    try:
        # Check if we should pregenerate
        if should_pregenerate():
            # Pregenerate all cards
            pregenerate_all_cards()
        else:
            logger.info("Skipping pregeneration")
    except Exception as e:
        logger.error(f"Error in main function: {e}")

if __name__ == "__main__":
    main() 