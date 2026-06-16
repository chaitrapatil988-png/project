import os
import glob
import re

dir_path = r'c:\Users\patil\Desktop\NEO'
html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Restore header navigation links
    # The structure is usually <li><a href="404.html" class="nav-link">Our Programs</a></li>
    content = re.sub(r'href="404\.html"\s*(class="nav-link[^"]*")>Our Programs', r'href="programs.html" \1>Our Programs', content)
    content = re.sub(r'href="404\.html"\s*(class="nav-link[^"]*")>Volunteers', r'href="volunteer.html" \1>Volunteers', content)
    content = re.sub(r'href="404\.html"\s*(class="nav-link[^"]*")>About Us', r'href="about.html" \1>About Us', content)
    content = re.sub(r'href="404\.html"\s*(class="nav-link[^"]*")>Contact', r'href="contact.html" \1>Contact', content)
    
    # Restore the mobile menu links if they are the same format
    # Wait, some are just <li><a href="...">...</a></li>
    # Let's use the text content to restore them
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Restored nav in {os.path.basename(file)}')
