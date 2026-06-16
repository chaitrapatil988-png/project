import os
import glob
import re

dir_path = r'c:\Users\patil\Desktop\NEO'
html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Desktop Header Donate Button
    content = re.sub(r'href="404\.html"(\s*class="btn btn-primary btn-sm btn-pulse"[^>]*>\s*<i[^>]*></i>\s*Donate\s+Now\s*</a)', r'href="donate.html"\1', content, flags=re.DOTALL)
    
    # Mobile Menu Donate Button
    content = re.sub(r'href="404\.html"(\s*class="btn btn-primary( w-full)?"[^>]*>\s*<i[^>]*></i>\s*Donate\s+Now\s*</a)', r'href="donate.html"\1', content, flags=re.DOTALL)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Restored donate in {os.path.basename(file)}')
