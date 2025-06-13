import os
import sys
import datetime
from PIL import Image, ImageDraw

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Add parent directory to path to import new_card_design
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import new_card_design

# Path to the FOMO image in downloaded_images
fomo_image_path = os.path.join(script_dir, "downloaded_images", "FOMO.png")

# Path for the output card
output_dir = os.path.join(script_dir, "new_gift_cards")
os.makedirs(output_dir, exist_ok=True)

print(f"Using FOMO image: {fomo_image_path}")
if not os.path.exists(fomo_image_path):
    print(f"ERROR: FOMO image not found at {fomo_image_path}")
    sys.exit(1)

# Create a copy of the FOMO image in the downloaded_images directory with a standardized name
# This is needed because the generate_specific_gift function expects the image to follow the naming convention
fomo_standard_name = "FOMO.png"
fomo_standard_path = os.path.join(script_dir, "downloaded_images", fomo_standard_name)

# The image is already there with the correct name, so we don't need to copy it

print("Generating FOMO card...")
try:
    # Create a dummy mock_gift_data function to override the API data
    def mock_fetch_gift_data(gift_name):
        """Return mock gift data with fixed values for FOMO"""
        if gift_name.upper() == "FOMO":
            return {
                "name": "FOMO",
                "priceUsd": 69,
                "priceTon": 69,
                "priceStars": 6969,
                "changePercentage": 420
            }
        return None
    
    # Create a dummy mock_chart_data function to override the API data
    def mock_fetch_chart_data(gift_name):
        """Return mock chart data with an upward trend"""
        chart_data = []
        base_value = 10.0
        current_time = datetime.datetime.now()
        
        # Generate 24 data points with steadily increasing values
        for i in range(24):
            # Super exponential growth for dramatic upward trend
            price = base_value * (1.25 ** i)  # 25% increase each hour - steeper curve
            timestamp = int((current_time - datetime.timedelta(hours=23-i)).timestamp())
            chart_data.append({
                "timestamp": timestamp,
                "price": price
            })
        return chart_data
    
    # Custom chart generation function that makes everything green and upward only
    def custom_generate_chart_image(width, height, chart_data, color=None):
        # Ensure it's bright green
        bright_green = (0, 255, 0)
        
        # Create a new image with a white background
        chart_img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
        draw = ImageDraw.Draw(chart_img)
        
        # Extract timestamps and prices from chart data
        timestamps = [entry["timestamp"] for entry in chart_data]
        prices = [entry["price"] for entry in chart_data]
        
        # Make sure values are strictly increasing
        for i in range(1, len(prices)):
            if prices[i] <= prices[i-1]:
                prices[i] = prices[i-1] * 1.1  # Ensure at least 10% increase
        
        # Find the min and max values to scale the chart
        min_timestamp = min(timestamps)
        max_timestamp = max(timestamps)
        min_price = min(prices) * 0.9  # Start the chart a bit lower to show the climb
        max_price = max(prices)
        
        # Scale x and y coordinates to chart dimensions
        points = []
        for i in range(len(timestamps)):
            x = int((timestamps[i] - min_timestamp) / (max_timestamp - min_timestamp) * width)
            y = height - int((prices[i] - min_price) / (max_price - min_price) * height * 0.9)
            points.append((x, y))
        
        # Add a starting point at the bottom-left
        points.insert(0, (0, height))
        # Add an ending point at the bottom-right
        points.append((width, height))
        
        # Draw a filled polygon for the area under the curve
        light_green = (200, 255, 200, 100)  # Light green with transparency
        draw.polygon(points, fill=light_green)
        
        # Draw the line with thickness
        line_points = points[1:-1]  # Remove the bottom corner points
        for i in range(len(line_points) - 1):
            draw.line([line_points[i], line_points[i+1]], fill=bright_green, width=5)
        
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
    output_path = new_card_design.generate_specific_gift("FOMO")
    
    # Restore original functions
    new_card_design.fetch_gift_data = original_fetch_gift_data
    new_card_design.fetch_chart_data = original_fetch_chart_data
    new_card_design.generate_chart_image = original_generate_chart_image
    
    if output_path:
        print(f"FOMO card successfully generated at: {output_path}")
    else:
        print("Failed to generate FOMO card")
except Exception as e:
    print(f"Error creating FOMO card: {e}")
    import traceback
    traceback.print_exc() 