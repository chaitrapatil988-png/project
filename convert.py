from PIL import Image
import os
import glob

image_dir = r'c:\Users\patil\Desktop\NEO\images'
png_files = glob.glob(os.path.join(image_dir, '*.png'))

for png_file in png_files:
    img = Image.open(png_file)
    webp_file = png_file.rsplit('.', 1)[0] + '.webp'
    img.save(webp_file, 'webp')
    print(f'Converted {png_file} to {webp_file}')
    os.remove(png_file)

