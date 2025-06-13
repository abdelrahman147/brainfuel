# Telegram Gift Price Bot

A Telegram bot that displays price cards for Telegram gifts with real-time pricing data. The bot creates stylized cards with gift images, price information, and price history charts.

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Core Components](#core-components)
3. [Quick Start](#quick-start)
4. [Bot Commands](#bot-commands)
5. [Technical Details](#technical-details)
6. [Development](#development)

## Project Architecture

The system has a modular architecture with these main components:

```
setup_and_run.sh
  ├─ main.py                # Downloads gift images & defines gift names
  ├─ pregenerate_backgrounds.py  # Creates color-matched backgrounds
  ├─ pregenerate_gift_cards.py   # Generates gift cards
  ├─ run_card_pregeneration.py   # Schedules regular updates
  └─ telegram_bot.py       # Main bot interface
```

### File Structure

- **Configuration:** `bot_config.py`, `requirements.txt`
- **Core Bot:** `telegram_bot.py`, `callback_handler.py`
- **Card Generation:** `new_card_design.py`, `pregenerate_gift_cards.py`
- **Special Cards:** `create_samir_card.py`, `create_fomo_card.py`, `create_zeus_card.py`
- **Utility:** `rate_limiter.py`, `image_uploader.py`
- **Setup:** `setup.py`, `setup_bot.py`, `setup_and_run.sh`

## Core Components

1. **Card Generation System**
   - Creates beautiful price cards with color gradients matching each gift
   - Includes real-time price data and price history charts
   - Pre-generates cards for faster response times

2. **Telegram Bot Interface**
   - Responds to commands like `/gift`, `/search`, etc.
   - Supports inline queries for finding gifts
   - Interactive buttons for navigation
   - Rate limiting to prevent abuse

3. **Background Generation**
   - Extracts dominant colors from gift images
   - Creates gradient backgrounds matching each gift

4. **Image Management**
   - Uploads images to catbox.moe for inline sharing
   - Caches uploads to improve performance

## Quick Start

### One-Command Setup

```bash
git clone <repository-url>
cd telegram-gift-price-bot
./setup_and_run.sh
```

This script will:
1. Create a Python virtual environment
2. Install required dependencies
3. Download gift images (if needed)
4. Pre-generate backgrounds and cards
5. Start the bot

### Manual Setup

1. **Install dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configure the bot:**
   ```bash
   python setup_bot.py
   ```
   Follow the prompts to enter your bot token from BotFather.

3. **Run the bot:**
   ```bash
   python telegram_bot.py
   ```

## Bot Commands

- `/start` - Introduction message
- `/help` - Display available commands
- `/gift` - Browse gift categories
- `/random` - Show a random gift card
- `/search [gift name]` - Search for specific gift(s)

Users can also send a gift name directly (e.g., "plush pepe") to get the matching gift card.

## Technical Details

### Data Flow

1. **Gift Image Source**
   - Gift images are downloaded from Telegram's CDN

2. **Price Data Source**
   - Real-time prices from API: `https://nft-gifts-api.onrender.com/gifts`
   - Chart data from API: `https://nft-gifts-api.onrender.com/weekChart`

3. **Card Generation Process**
   - Extract dominant color from gift image
   - Create gradient background using that color
   - Generate price chart from API data
   - Combine elements with gift name and price information

4. **Periodic Updates**
   - Cards are regenerated every 32 minutes to ensure fresh pricing data

### File Storage

- `downloaded_images/` - Original gift images
- `pregenerated_backgrounds/` - Color-matched gradient backgrounds
- `card_templates/` - Static template cards 
- `new_gift_cards/` - Final generated cards

## Development

### Rate Limiting

The system uses SQLite to enforce rate limits:
- One request per minute per user/gift combination
- Tracks message ownership for deletion permissions
- Database in `user_requests.db`

### Special "Easter Egg" Cards

The bot includes special hidden cards that can be triggered with keywords:
- SAMIR
- FOMO
- ZEUS

### Using the Bot in Group Chats

1. Add the bot to a group chat
2. Make the bot an admin (recommended for better functionality)
3. Users can trigger the bot by:
   - Mentioning the bot by username (e.g., "@YourBotName plush pepe")
   - Using commands (e.g., "/gift")

### Inline Mode

To use inline mode (in any chat):
1. Type your bot's username followed by a space
2. Enter a gift name to search for
3. Select a result to send a gift card in that chat

## Prerequisites

- Python 3.8+
- Telegram bot token from @BotFather
- Internet connection to access the price API

## License and Credits

This project is for educational purposes only. All Telegram gift images are owned by Telegram.

Built with:
- python-telegram-bot
- Pillow for image processing
- Catbox.moe for image hosting 