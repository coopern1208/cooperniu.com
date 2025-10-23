from PIL import Image

def white_to_transparent(input_path, output_path):
    # Open the image
    img = Image.open(input_path).convert("RGBA").resize((275,275))
    datas = img.getdata()

    new_data = []
    for item in datas:
        # If the pixel is close to white, make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))  # Fully transparent
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

# Example usage:
white_to_transparent("utils/test.png", "images/favicon.png")