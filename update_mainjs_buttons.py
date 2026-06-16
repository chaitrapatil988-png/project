import re

with open(r'c:\Users\patil\Desktop\NEO\js\main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace "Expand Your Support" href
content = re.sub(r'href="donate\.html"([^>]*>\s*<i[^>]*></i>\s*Expand Your Support)', r'href="404.html"\1', content)

# Replace "Inspect Active Hashes" onclick
content = re.sub(r'onclick="document\.querySelector\(' + r"'\[data-tab=telemetry\]'" + r'\)\.click\(\);"([^>]*>\s*<i[^>]*></i>\s*Inspect Active Hashes)', r'onclick="window.location.href=\'404.html\'"\1', content)

with open(r'c:\Users\patil\Desktop\NEO\js\main.js', 'w', encoding='utf-8') as f:
    f.write(content)
