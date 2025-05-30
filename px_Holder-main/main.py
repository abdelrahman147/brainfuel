import os
import requests
import re
import json
import time
import telebot
from datetime import datetime
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont
import io

# Load environment variables
load_dotenv()

# Initialize the bot with environment variables
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

if not BOT_TOKEN or not CHAT_ID:
    raise ValueError("Missing Telegram Bot Token or Chat ID in environment variables")

bot = telebot.TeleBot(BOT_TOKEN)
chat_id = int(CHAT_ID)  # Ensure CHAT_ID is an integer

# Reference prices for $PX
previous_prices = {
    'high': 0.3,
    'low': 0.2
}

# Path to template image
TEMPLATE_IMAGE_PATH = "assets/template.png"

# Check if template image exists, if not, create a placeholder
if not os.path.exists(TEMPLATE_IMAGE_PATH):
    print(f"Warning: Template image not found at {TEMPLATE_IMAGE_PATH}")
    print("Using text-based updates until template is provided")

def format_price(price, coin_name):
    if coin_name == "px":
        return "{:.4f}".format(price)  # Forces 4 decimal digits (e.g., 0.0710)
    elif coin_name == "ton":
        return round(price, 2)  # TON remains at 2 decimal digits
    return round(price)

def calculate_exact_loss_percentage(initial_price, current_price):
    """Calculate loss percentage with 2 decimal places precision"""
    loss = initial_price - current_price
    percentage = (loss / initial_price) * 100
    # Format with 2 decimal places and always show negative
    return f"-{abs(percentage):.2f}%"

def get_prices():
    try:
        cmc_home = requests.get("https://coinmarketcap.com/", timeout=10)
        px_page = requests.get("https://coinmarketcap.com/currencies/not-pixel/", timeout=10)
        ton_page = requests.get("https://coinmarketcap.com/currencies/toncoin/", timeout=10)

        if cmc_home.status_code != 200 or px_page.status_code != 200 or ton_page.status_code != 200:
            print("Failed to retrieve data")
            return None, None

        # Parse trending coins from homepage
        trending_match = re.search(r'"highlightsData":\{"trendingList":(\[.*?\])', cmc_home.text)
        if trending_match:
            try:
                trending_list = json.loads(trending_match.group(1))
                for coin in trending_list:
                    name = coin.get("name", "").replace(" ", "_").lower()
                    price = coin.get("priceChange", {}).get("price")
                    if price:
                        globals()[name] = float(price)
            except Exception as e:
                print(f"Error parsing trending list: {e}")
        else:
            print("Trending list not found")

        # Parse TON price
        ton_match = re.search(r'"statistics":(\{.*?\})', ton_page.text)
        ton_price = None
        if ton_match:
            try:
                ton_stats = json.loads(ton_match.group(1))
                ton_price = float(ton_stats.get("price", 0))
            except Exception as e:
                print(f"TON JSON error: {e}")

        # Parse PX price
        px_match = re.search(r'"statistics":(\{.*?\})', px_page.text)
        px_price = None
        if px_match:
            try:
                px_stats = json.loads(px_match.group(1))
                px_price = float(px_stats.get("price", 0))
            except Exception as e:
                print(f"PX JSON error: {e}")

        return px_price, ton_price

    except Exception as e:
        print(f"General error: {e}")
        return None, None

def create_price_image(px_price, ton_price):
    """Create an image with the price information overlaid on the template"""
    
    # Check if template exists
    if not os.path.exists(TEMPLATE_IMAGE_PATH):
        # If no template, fall back to text-based updates
        return None
    
    try:
        # Open the template image
        template = Image.open(TEMPLATE_IMAGE_PATH)
        draw = ImageDraw.Draw(template)
        
        # Get image dimensions
        width, height = template.size
        
        # Calculate font size based on image width
        dynamic_font_size = int(width * 0.10)  # Main PX price
        secondary_font_size = int(width * 0.05)  # TON price
        small_font_size = int(width * 0.022)  # Loss percentages
        
        # Try to load font, fall back to default if not available
        font_large = None
        font_medium = None
        font_small = None
        
        # First try the VCR_OSD_MONO font (retro digital display style)
        vcr_font_path = "VCR_OSD_MONO_1.001.ttf"
        try:
            font_large = ImageFont.truetype(vcr_font_path, dynamic_font_size)
            font_medium = ImageFont.truetype(vcr_font_path, secondary_font_size)
            font_small = ImageFont.truetype(vcr_font_path, small_font_size)
            print(f"Using VCR OSD Mono font")
        except Exception as e:
            print(f"Could not load VCR OSD Mono font: {e}")
            
            # Fall back to default
            font_large = ImageFont.load_default()
            font_medium = ImageFont.load_default()
            font_small = ImageFont.load_default()
        
        # Format prices
        px_price_formatted = format_price(px_price, 'px')
        ton_price_formatted = format_price(ton_price, 'ton')
        
        # Calculate percentages
        loss_high = calculate_exact_loss_percentage(previous_prices['high'], px_price)
        loss_low = calculate_exact_loss_percentage(previous_prices['low'], px_price)
        
        # Simple positioning
        main_price_position = (width // 2, height // 3)  # Upper third
        ton_price_position = (width // 2, height // 1.5)  # Middle
        loss_info_position = (width // 2, height - 50)  # Bottom
        
        # Text content
        main_price_text = f"${px_price_formatted}"
        ton_price_text = f"${ton_price_formatted}"
        loss_info_text = f"Lose% $0.2 = {loss_low} | Lose% $0.3 = {loss_high}"
        
        # Draw the price text with simple border
        border_size = int(dynamic_font_size * 0.1)  # 10% of font size
        
        # Simple border for main price - reduced to 1 pixel offset
        draw.text((main_price_position[0]+1, main_price_position[1]+1), 
                 main_price_text, fill=(0, 0, 0), font=font_large, anchor="mm")
        
        # Main text in white
        draw.text(main_price_position, main_price_text, fill=(255, 255, 255), 
                font=font_large, anchor="mm")
        
        # TON price - reduced to 1 pixel offset
        draw.text((ton_price_position[0]+1, ton_price_position[1]+1), 
                ton_price_text, fill=(0, 0, 0), font=font_medium, anchor="mm")
        
        draw.text(ton_price_position, ton_price_text, fill=(255, 255, 255), 
                font=font_medium, anchor="mm")
        
        # Loss info - keeping 1 pixel offset
        draw.text((loss_info_position[0]+1, loss_info_position[1]+1), 
                loss_info_text, fill=(0, 0, 0), font=font_small, anchor="mm")
        
        draw.text(loss_info_position, loss_info_text, fill=(255, 255, 255), 
                font=font_small, anchor="mm")
        
        # Save the image to a bytes buffer
        img_byte_array = io.BytesIO()
        template.save(img_byte_array, format='PNG')
        img_byte_array.seek(0)
        
        return img_byte_array
    
    except Exception as e:
        print(f"Error creating image: {e}")
        return None

def send_price_update():
    px_price, ton_price = get_prices()
    if px_price and ton_price:
        # Try to create and send image
        img_buffer = create_price_image(px_price, ton_price)
        
        # Format prices for text message
        px_price_formatted = format_price(px_price, 'px')
        ton_price_formatted = format_price(ton_price, 'ton')
        
        # Calculate percentages
        loss_high = calculate_exact_loss_percentage(previous_prices['high'], px_price)
        loss_low = calculate_exact_loss_percentage(previous_prices['low'], px_price)
        
        # Format text message - using plain text without markdown to avoid parsing errors
        message_text = f"""
$PX {px_price_formatted}$  
From 0.3$ = {loss_high} 
From 0.2$ = {loss_low}

$TON {ton_price_formatted}$
─────────────────────
@PX_Watcher
"""
        
        if img_buffer:
            # Send the image with caption
            bot.send_photo(chat_id=chat_id, photo=img_buffer, caption=message_text)
        else:
            # Fallback to text if image creation fails
            bot.send_message(chat_id=chat_id, text=message_text)

# Use update_interval from .env if provided, otherwise default to 60 seconds
update_interval = int(os.getenv("UPDATE_INTERVAL", "60"))
last_update_time = 0

print(f"Bot started. Sending price updates every {update_interval} seconds.")

# Main loop
while True:
    try:
        current_time = time.time()
        
        # Check if it's time to send an update
        if current_time - last_update_time >= update_interval:
            send_price_update()
            last_update_time = current_time
        
        time.sleep(1)  # Check every second but only send based on update_interval
    except Exception as e:
        print(f"Error in main loop: {e}")
        time.sleep(5)  # Wait a bit before retrying
