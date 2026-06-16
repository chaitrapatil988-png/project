import re

with open(r'c:\Users\patil\Desktop\NEO\js\main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace .png with .webp for avatar images in JS
content = re.sub(r'avatar_kavya\.png', 'avatar_kavya.webp', content)
content = re.sub(r'avatar_rahul\.png', 'avatar_rahul.webp', content)
content = re.sub(r'avatar_devendra\.png', 'avatar_devendra.webp', content)
content = re.sub(r'avatar_anita\.png', 'avatar_anita.webp', content)

with open(r'c:\Users\patil\Desktop\NEO\js\main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated avatar image extensions in JS.')
