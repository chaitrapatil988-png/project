import os
import glob
import re

dir_path = r'c:\Users\patil\Desktop\NEO'
html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Restore the dropdown 'Our Programs' link which has a different format
    content = re.sub(r'href="404\.html"(\s*class="nav-link[^"]*">\s*Our Programs)', r'href="programs.html"\1', content)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Restored dropdown in {os.path.basename(file)}')
