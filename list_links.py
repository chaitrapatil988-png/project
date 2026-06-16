import re

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

links = re.findall(r'<a[^>]+href="([^"]+)"', content)
buttons = re.findall(r'<button[^>]*>', content)
print("Links in index.html:")
for l in set(links): print(l)
print("\nButtons in index.html:")
for b in set(buttons): print(b)
