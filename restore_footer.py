import os
import glob
import re

dir_path = r'c:\Users\patil\Desktop\NEO'
html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Navigation
    content = re.sub(r'href="404\.html"(\s*class="footer-link"[^>]*>\s*<i[^>]*></i>\s*Our\s+Programs\s*</a)', r'href="programs.html"\1', content, flags=re.DOTALL)
    content = re.sub(r'href="404\.html"(\s*class="footer-link"[^>]*>\s*<i[^>]*></i>\s*Volunteers\s*</a)', r'href="volunteer.html"\1', content, flags=re.DOTALL)
    content = re.sub(r'href="404\.html"(\s*class="footer-link"[^>]*>\s*<i[^>]*></i>\s*About\s+Us\s*</a)', r'href="about.html"\1', content, flags=re.DOTALL)
    content = re.sub(r'href="404\.html"(\s*class="footer-link"[^>]*>\s*<i[^>]*></i>\s*Contact\s*</a)', r'href="contact.html"\1', content, flags=re.DOTALL)
    
    # Focus Areas
    content = re.sub(r'href="404\.html"(\s*class="footer-link"[^>]*>\s*<i[^>]*></i>\s*Digital\s+Schooling\s*</a)', r'href="programs.html?filter=education"\1', content, flags=re.DOTALL)
    content = re.sub(r'href="404\.html"(\s*class="footer-link"[^>]*>\s*<i[^>]*></i>\s*Pediatric\s+Care\s*</a)', r'href="programs.html?filter=healthcare"\1', content, flags=re.DOTALL)
    content = re.sub(r'href="404\.html"(\s*class="footer-link"[^>]*>\s*<i[^>]*></i>\s*Clean\s+Water\s+Plants\s*</a)', r'href="programs.html"\1', content, flags=re.DOTALL)
    content = re.sub(r'href="404\.html"(\s*class="footer-link"[^>]*>\s*<i[^>]*></i>\s*Nutrition\s+Hubs\s*</a)', r'href="programs.html?filter=hunger"\1', content, flags=re.DOTALL)
    content = re.sub(r'href="404\.html"(\s*class="footer-link"[^>]*>\s*<i[^>]*></i>\s*Agroforestry\s*</a)', r'href="programs.html?filter=environment"\1', content, flags=re.DOTALL)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Restored footer in {os.path.basename(file)}')
