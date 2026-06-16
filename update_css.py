import re

with open(r'c:\Users\patil\Desktop\NEO\css\main.css', 'r', encoding='utf-8') as f:
    content = f.read()

new_btns = """
.btn-green {
  background: linear-gradient(135deg, #16A34A 0%, #22C55E 100%);
  color: #fff; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}
.btn-green:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4); filter: brightness(1.08); }

.btn-amber {
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
  color: #060912; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}
.btn-amber:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4); filter: brightness(1.08); }
"""

# Insert right after .btn-cyan:hover block
content = re.sub(r'(\.btn-cyan:hover[^}]*\})', r'\1' + new_btns, content)

with open(r'c:\Users\patil\Desktop\NEO\css\main.css', 'w', encoding='utf-8') as f:
    f.write(content)
