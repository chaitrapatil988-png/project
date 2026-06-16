import os
import glob
import re

dir_path = r'c:\Users\patil\Desktop\NEO'
html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Fix the Clean Water Plants link
    content = re.sub(r'href="programs\.html"(\s*class="footer-link"[^>]*>\s*<i[^>]*></i>\s*Clean\s+Water\s+Plants\s*</a)', r'href="programs.html?filter=water"\1', content, flags=re.DOTALL)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed water filter in {os.path.basename(file)}')
