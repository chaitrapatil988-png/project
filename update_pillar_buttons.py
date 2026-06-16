import re

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace btn-ghost with btn-primary for Explore buttons in pillar-body
# They look like: class="btn btn-ghost btn-sm" style="justify-content: center"
# And they are preceded by </p> in the pillar-body
content = re.sub(r'(class="btn )btn-ghost( btn-sm"[^>]*><i class="fas fa-arrow-right"></i>\s*(Explore Schools|Support Clinics|Fund Plants|Sponsor Hubs))', r'\1btn-primary\2', content)

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated pillar buttons to btn-primary.')
