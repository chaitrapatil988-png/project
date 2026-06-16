import re

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# find all href="xyz.html" and their line numbers
lines = content.split('\n')
for i, line in enumerate(lines):
    if 'href=' in line and '404.html' not in line and 'login.html' not in line and 'register.html' not in line and 'portal.html' not in line and 'index.html' not in line:
        # only show local html files
        if re.search(r'href="[^"]+\.html[^"]*"', line):
            print(f"{i+1}: {line.strip()}")
