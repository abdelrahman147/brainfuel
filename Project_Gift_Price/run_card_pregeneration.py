#!/usr/bin/env python3
import os
import sys
import time
import subprocess
import logging
import signal
import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("pregeneration_scheduler.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("pregeneration_scheduler")

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
pregenerate_script = os.path.join(script_dir, "pregenerate_gift_cards.py")

# Time between generations in seconds (32 minutes)
GENERATION_INTERVAL = 32 * 60

# Maximum year to detect system clock issues (as of 2023)
MAX_VALID_YEAR = 2024

# Flag to control the main loop
running = True

def signal_handler(sig, frame):
    """Handle Ctrl+C to gracefully exit"""
    global running
    logger.info("Received signal to terminate. Shutting down...")
    running = False

def format_time_until_next_run(seconds):
    """Format time until next run in a human-readable format"""
    minutes, seconds = divmod(seconds, 60)
    return f"{int(minutes)} minutes and {int(seconds)} seconds"

def check_clock_issue():
    """Check if the system clock might have issues (e.g., set to future date)"""
    current_year = datetime.datetime.now().year
    if current_year > MAX_VALID_YEAR:
        logger.warning(f"Detected potentially incorrect system clock - year {current_year}")
        return True
    return False

def run_pregeneration():
    """Run the pregeneration script with proper error handling"""
    try:
        process = subprocess.run(
            [sys.executable, pregenerate_script],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=600  # 10 minute timeout
        )
        logger.info("Card generation completed successfully")
        return True
    except subprocess.TimeoutExpired:
        logger.error("Card generation timed out after 10 minutes")
        return False
    except subprocess.CalledProcessError as e:
        logger.error(f"Card generation failed with exit code {e.returncode}")
        if e.stdout:
            logger.debug(f"Process stdout: {e.stdout}")
        if e.stderr:
            logger.error(f"Process stderr: {e.stderr}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error running card generation: {e}")
        return False

def main():
    """Main function to run the pre-generation script at regular intervals"""
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    logger.info("Card pre-generation scheduler started")
    logger.info(f"Will generate cards every {GENERATION_INTERVAL // 60} minutes")
    
    # Check for system clock issues
    if check_clock_issue():
        logger.warning("System clock may be incorrect - will continue but timestamps may be wrong")
    
    # Run immediately at startup
    logger.info("Running initial card generation...")
    run_pregeneration()
    
    last_run_time = time.time()
    
    # Main loop
    while running:
        try:
            current_time = time.time()
            elapsed = current_time - last_run_time
            
            # Sanity check elapsed time (negative time would indicate clock issues)
            if elapsed < 0:
                logger.warning("Detected negative elapsed time - system clock may have changed")
                # Reset last_run_time in this case
                last_run_time = current_time - (GENERATION_INTERVAL - 60)
                elapsed = 60
            
            if elapsed >= GENERATION_INTERVAL:
                # Time to run again
                current_datetime = datetime.datetime.now()
                logger.info(f"Running scheduled card generation at {current_datetime.strftime('%Y-%m-%d %H:%M:%S')}")
                
                success = run_pregeneration()
                if success:
                    last_run_time = time.time()
                else:
                    # On failure, wait a shorter time before trying again
                    logger.info("Will try again in 5 minutes")
                    last_run_time = time.time() - (GENERATION_INTERVAL - 300)
            else:
                # Wait until next run
                time_until_next_run = GENERATION_INTERVAL - elapsed
                logger.info(f"Next generation in {format_time_until_next_run(time_until_next_run)}")
                
                # Sleep for a minute or until the next run time, whichever is shorter
                sleep_time = min(60, time_until_next_run)
                time.sleep(sleep_time)
        except Exception as e:
            logger.error(f"Error in main loop: {e}")
            # Sleep for a minute before continuing
            time.sleep(60)

if __name__ == "__main__":
    main() 