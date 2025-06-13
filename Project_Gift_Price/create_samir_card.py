import os
import sys
import datetime
from PIL import Image, ImageDraw

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Add parent directory to path to import new_card_design
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import new_card_design

# Path to the Samir image in downloaded_images
samir_image_path = os.path.join(script_dir, "downloaded_images", "smair.png")

# Path for the output card
output_dir = os.path.join(script_dir, "new_gift_cards")
os.makedirs(output_dir, exist_ok=True)

print(f"Using Samir image: {samir_image_path}")
if not os.path.exists(samir_image_path):
    print(f"ERROR: Samir image not found at {samir_image_path}")
    sys.exit(1)

# Create a copy of the Samir image in the downloaded_images directory with a standardized name
samir_standard_name = "SAMIR.png"
samir_standard_path = os.path.join(script_dir, "downloaded_images", samir_standard_name)

# Copy the image if it doesn't exist with the standardized name
if not os.path.exists(samir_standard_path) and samir_image_path != samir_standard_path:
    import shutil
    shutil.copy(samir_image_path, samir_standard_path)
    print(f"Copied image to {samir_standard_path}")

print("Generating Samir card...")
try:
    # Create a dummy mock_gift_data function to override the API data
    def mock_fetch_gift_data(gift_name):
        """Return mock gift data with extremely negative values for Samir"""
        if gift_name.upper() == "SAMIR":
            return {
                "name": "SAMIR",
                "priceUsd": -9999,  # Very negative number
                "priceTon": -9999,  # Very negative number
                "priceStars": -9999,
                "changePercentage": -99.9
            }
        return None
    
    # Create a dummy mock_chart_data function to override the API data
    def mock_fetch_chart_data(gift_name):
        """Return mock chart data with a downward trend"""
        chart_data = []
        base_value = 100.0  # Start high
        current_time = datetime.datetime.now()
        
        # Generate 24 data points with steadily decreasing values
        for i in range(24):
            # Exponential decay for dramatic downward trend
            price = base_value * (0.85 ** i)  # 15% decrease each hour
            timestamp = int((current_time - datetime.timedelta(hours=23-i)).timestamp())
            chart_data.append({
                "timestamp": timestamp,
                "price": price
            })
        return chart_data
    
    # Custom chart generation function that makes everything red and downward only
    def custom_generate_chart_image(width, height, chart_data, color=None):
        # Ensure it's bright red
        bright_red = (255, 0, 0)
        
        # Create a new image with a white background
        chart_img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
        draw = ImageDraw.Draw(chart_img)
        
        # Extract timestamps and prices from chart data
        timestamps = [entry["timestamp"] for entry in chart_data]
        prices = [entry["price"] for entry in chart_data]
        
        # Make sure values are strictly decreasing
        for i in range(1, len(prices)):
            if prices[i] >= prices[i-1]:
                prices[i] = prices[i-1] * 0.8  # Ensure at least 20% decrease
        
        # Find the min and max values to scale the chart
        min_timestamp = min(timestamps)
        max_timestamp = max(timestamps)
        min_price = min(prices)
        max_price = max(prices) * 1.1  # Start the chart a bit higher to show the fall
        
        # Scale x and y coordinates to chart dimensions
        points = []
        for i in range(len(timestamps)):
            x = int((timestamps[i] - min_timestamp) / (max_timestamp - min_timestamp) * width)
            y = height - int((prices[i] - min_price) / (max_price - min_price) * height * 0.9)
            points.append((x, y))
        
        # Add a starting point at the top-left
        points.insert(0, (0, 0))
        # Add an ending point at the top-right
        points.append((width, 0))
        
        # Draw a filled polygon for the area above the curve
        light_red = (255, 200, 200, 100)  # Light red with transparency
        draw.polygon(points, fill=light_red)
        
        # Draw the line with thickness
        line_points = points[1:-1]  # Remove the top corner points
        for i in range(len(line_points) - 1):
            draw.line([line_points[i], line_points[i+1]], fill=bright_red, width=5)
        
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
    output_path = new_card_design.generate_specific_gift("SAMIR")
    
    # Restore original functions
    new_card_design.fetch_gift_data = original_fetch_gift_data
    new_card_design.fetch_chart_data = original_fetch_chart_data
    new_card_design.generate_chart_image = original_generate_chart_image
    
    if output_path:
        print(f"Samir card successfully generated at: {output_path}")
    else:
        print("Failed to generate Samir card")
except Exception as e:
    print(f"Error creating Samir card: {e}")
    import traceback
    traceback.print_exc() 