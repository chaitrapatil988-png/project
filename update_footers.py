import os
import re

directory = '.'

# Read index.html to extract the footer
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract footer from index.html
# We match from <footer class="footer"> to </footer>
footer_match = re.search(r'(<footer class="footer">.*?</footer>)', index_content, flags=re.DOTALL)
if not footer_match:
    print("Footer not found in index.html")
    exit(1)

# Escape backslashes for re.sub replacement string so things like \n don't get mangled
new_footer = footer_match.group(1).replace('\\', '\\\\')

# Iterate over all html files
for filename in os.listdir(directory):
    if filename.endswith('.html') and filename != 'index.html':
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check if the file has a footer
        if '<footer class="footer">' in content:
            # Replace the footer block
            # We use lambda to avoid issues with backreferences in replacement string
            updated_content = re.sub(
                r'<footer class="footer">.*?</footer>',
                lambda _: footer_match.group(1),
                content,
                flags=re.DOTALL
            )
            
            if updated_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"Updated footer in {filename}")
            else:
                print(f"Footer already matches in {filename}")
        else:
            print(f"No footer found in {filename}")

print("Done updating footers.")
