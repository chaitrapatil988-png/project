import re

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add margin-top: auto to the buttons in pillar-body
content = re.sub(r'(class="btn[^"]*" style="justify-content: center)', r'\1; margin-top: auto', content)

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Added margin-top: auto to buttons.')
