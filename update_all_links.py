import os
import glob
import re

dir_path = r'c:\Users\patil\Desktop\NEO'
html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # We want to replace href="donate.html", href="programs.html", etc. with href="404.html"
    # This regex catches href="donate.html", href="programs.html?filter=xyz", etc.
    content = re.sub(r'href="(about|contact|donate|programs|volunteer)\.html[^"]*"', r'href="404.html"', content)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {os.path.basename(file)}')
