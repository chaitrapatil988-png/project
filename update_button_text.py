import re

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Change "Support Clinics" to "Explore Clinics"
content = content.replace("Support Clinics", "Explore Clinics")

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated button text to Explore Clinics.')
