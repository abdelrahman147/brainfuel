import os
import sys
import datetime
from PIL import Image, ImageDraw

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Add parent directory to path to import new_card_design
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import new_card_design

# Path to the Zeus image in downloaded_images
zeus_image_path = os.path.join(script_dir, "downloaded_images", "zeus.png")

# Path for the output card
output_dir = os.path.join(script_dir, "new_gift_cards")
os.makedirs(output_dir, exist_ok=True)

print(f"Using Zeus image: {zeus_image_path}")
if not os.path.exists(zeus_image_path):
    print(f"ERROR: Zeus image not found at {zeus_image_path}")
    sys.exit(1)

# Create a copy of the Zeus image in the downloaded_images directory with a standardized name
zeus_standard_name = "ZEUS.png"
zeus_standard_path = os.path.join(script_dir, "downloaded_images", zeus_standard_name)

# Copy the image if it doesn't exist with the standardized name
if not os.path.exists(zeus_standard_path) and zeus_image_path != zeus_standard_path:
    import shutil
    shutil.copy(zeus_image_path, zeus_standard_path)
    print(f"Copied image to {zeus_standard_path}")

print("Generating Zeus card...")
try:
    # Create a dummy mock_gift_data function to override the API data
    def mock_fetch_gift_data(gift_name):
        """Return mock gift data with custom values for Zeus"""
        if gift_name.upper() == "ZEUS":
            return {
                "name": "يا عبيط",
                "priceUsd": 5,
                "priceTon": 5,
                "priceStars": 555,
                "changePercentage": -50
            }
        return None
    
    # Create a dummy mock_chart_data function to override the API data with a custom pattern
    def mock_fetch_chart_data(gift_name):
        """Return mock chart data with the custom Zeus drawing pattern"""
        chart_data = []
        current_time = datetime.datetime.now()
        
        # Generate chart data points to mimic the Zeus drawing
        # The drawing has three main peaks, with the middle one being the highest
        values = [
            50, 40, 30, 20, 10, 5, 10, 20, 30, 40, 50, 60, 70, 100, 80, 60, 40, 20,
            10, 15, 20, 40, 30, 20
        ]
        
        for i in range(24):
            timestamp = int((current_time - datetime.timedelta(hours=23-i)).timestamp())
            chart_data.append({
                "timestamp": timestamp,
                "price": values[i]
            })
        return chart_data
    
    # Custom chart generation function that creates the Zeus chart pattern
    def custom_generate_chart_image(width, height, chart_data, color=None):
        # Use bright red for Zeus
        bright_red = (255, 0, 0)
        
        # Create a new image with a white background
        chart_img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
        draw = ImageDraw.Draw(chart_img)
        
        # Extract timestamps and prices from chart data
        timestamps = [entry["timestamp"] for entry in chart_data]
        prices = [entry["price"] for entry in chart_data]
        
        # Find the min and max values to scale the chart
        min_timestamp = min(timestamps)
        max_timestamp = max(timestamps)
        min_price = min(prices)
        max_price = max(prices)
        
        # Scale x and y coordinates to chart dimensions
        points = []
        for i in range(len(timestamps)):
            x = int((timestamps[i] - min_timestamp) / (max_timestamp - min_timestamp) * width)
            y = height - int((prices[i] - min_price) / (max_price - min_price) * height * 0.9)
            points.append((x, y))
        
        # Draw the line with thickness
        for i in range(len(points) - 1):
            draw.line([points[i], points[i+1]], fill=bright_red, width=5)
        
        return chart_img, min_price, max_price
    
    # Save original functions
    original_fetch_gift_data = new_card_design.fetch_gift_data
    original_fetch_chart_data = new_card_design.fetch_chart_data
    original_generate_chart_image = new_card_design.generate_chart_image
    
    # Replace with our mock functions
    new_card_design.fetch_gift_data = mock_fetch_gift_data
    new_card_design.fetch_chart_data = mock_fetch_chart_data
    new_card_design.generate_chart_image = custom_generate_chart_image
    
    # Generate the card using the standard process
    output_path = new_card_design.generate_specific_gift("ZEUS")
    
    # Restore original functions
    new_card_design.fetch_gift_data = original_fetch_gift_data
    new_card_design.fetch_chart_data = original_fetch_chart_data
    new_card_design.generate_chart_image = original_generate_chart_image
    
    if output_path:
        print(f"Zeus card successfully generated at: {output_path}")
    else:
        print("Failed to generate Zeus card")
except Exception as e:
    print(f"Error creating Zeus card: {e}")
    import traceback
    traceback.print_exc() 