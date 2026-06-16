import re

with open(r'c:\Users\patil\Desktop\NEO\portal.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the escaped quotes
content = content.replace("href=\\'404.html\\'", "href='404.html'")

with open(r'c:\Users\patil\Desktop\NEO\portal.html', 'w', encoding='utf-8') as f:
    f.write(content)

with open(r'c:\Users\patil\Desktop\NEO\js\main.js', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace("href=\\'404.html\\'", "href='404.html'")

with open(r'c:\Users\patil\Desktop\NEO\js\main.js', 'w', encoding='utf-8') as f:
    f.write(content2)

print('Fixed escaped quotes.')
