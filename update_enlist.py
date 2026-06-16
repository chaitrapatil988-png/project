import re

with open(r'c:\Users\patil\Desktop\NEO\js\main.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'href="volunteer\.html"([^>]*>\s*<i[^>]*></i>\s*Enlist in a Squad)', r'href="404.html"\1', content)

with open(r'c:\Users\patil\Desktop\NEO\js\main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated Enlist in a Squad link.')
