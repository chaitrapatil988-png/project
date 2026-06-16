import re

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update description
old_desc = r"A targeted approach to localized impact, mapped directly to outcomes."
new_desc = r"We channel resources into targeted grids of local aid, fostering sustainable growth and health for generations to come."
# Let's just do a generic replace around the section title.
content = re.sub(r'(<h2 class="section-title"[^>]*>\s*Four Pillars of <span>Community Care</span>\s*</h2>\s*<p class="section-desc">)[^<]+(</p>)', r'\1' + new_desc + r'\2', content)

# 2. Update button colors
content = re.sub(r'(class="btn )btn-primary( btn-sm"[^>]*><i class="fas fa-arrow-right"></i>\s*Explore Clinics)', r'\1btn-cyan\2', content)
content = re.sub(r'(class="btn )btn-primary( btn-sm"[^>]*><i class="fas fa-arrow-right"></i>\s*Fund Plants)', r'\1btn-green\2', content)
content = re.sub(r'(class="btn )btn-primary( btn-sm"[^>]*><i class="fas fa-arrow-right"></i>\s*Sponsor Hubs)', r'\1btn-amber\2', content)

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated text and button colors in index.html.')
