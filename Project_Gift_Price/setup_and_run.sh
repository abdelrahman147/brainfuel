#!/bin/bash

# Set error handling
set -e

# Absolute path to this script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
  echo "Creating new virtual environment..."
  python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Check if we need to download images
if [ ! -d "downloaded_images" ] || [ -z "$(ls -A downloaded_images 2>/dev/null)" ]; then
  echo "Downloading gift images..."
  python3 main.py
fi

# Pregenerate backgrounds if they don't exist
if [ ! -d "pregenerated_backgrounds" ] || [ -z "$(ls -A pregenerated_backgrounds 2>/dev/null)" ]; then
  echo "Generating background images..."
  python3 pregenerate_backgrounds.py
fi

# Run the card pre-generation script first to ensure we have all cards
echo "Pre-generating gift cards..."
python3 pregenerate_gift_cards.py

# Store the pid file for the background process
PID_FILE="$SCRIPT_DIR/.pregeneration_pid"

# Function to cleanup before exit
cleanup() {
  echo "Cleaning up processes..."
  
  # Check if pid file exists and kill the process
  if [ -f "$PID_FILE" ]; then
    PREGENERATION_PID=$(cat "$PID_FILE")
    if ps -p "$PREGENERATION_PID" > /dev/null; then
      echo "Stopping card pre-generation scheduler (PID: $PREGENERATION_PID)..."
      kill "$PREGENERATION_PID" 2>/dev/null || kill -9 "$PREGENERATION_PID" 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
  fi
  
  # Deactivate virtual environment
  if [ -n "$VIRTUAL_ENV" ]; then
    echo "Deactivating virtual environment..."
    deactivate || true
  fi
  
  echo "Cleanup complete"
}

# Set trap to ensure cleanup happens
trap cleanup EXIT INT TERM

# Start the card pre-generation scheduler in the background
echo "Starting card pre-generation scheduler..."
python3 run_card_pregeneration.py &
PREGENERATION_PID=$!
echo "$PREGENERATION_PID" > "$PID_FILE"

# Run the bot
echo "Starting Telegram bot..."
python3 telegram_bot.py

# Script will continue after the bot stops or is interrupted
echo "Bot has stopped."

# No need to manually call cleanup as the trap will handle it 