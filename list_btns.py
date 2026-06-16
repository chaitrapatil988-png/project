import re

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

buttons = re.findall(r'<button[^>]*>.*?</button>', content, re.DOTALL)
print("Buttons:")
for b in buttons: print(b.strip())

links_btn = re.findall(r'<a[^>]*class="[^"]*btn[^"]*"[^>]*>.*?</a>', content, re.DOTALL)
print("\nAnchor Buttons:")
for b in links_btn: print(b.strip())
