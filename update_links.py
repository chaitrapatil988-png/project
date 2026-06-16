import os
import glob
import re

dir_path = r'c:\Users\patil\Desktop\NEO'
html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    # Replace href="#" with href="404.html" EXCEPT when there is an onclick handler or data-tab (like in portal.html)
    # Using regex to carefully target footer links and social buttons
    content = re.sub(r'href="#"\s+class="footer-bottom-link"', r'href="404.html" class="footer-bottom-link"', content)
    content = re.sub(r'href="#"\s+class="social-btn"', r'href="404.html" class="social-btn"', content)
    
    # Replace newsletter form onsubmit
    content = re.sub(r'<form([^>]+)onsubmit="return false;"', r'<form\1action="404.html"', content)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
