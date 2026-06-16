import re

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_form = """                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-check"></i> Subscribe
                            </button>
                            <input
                                type="email"
                                class="form-input"
                                placeholder="Enter your email address"
                                required
                                style="flex: 1"
                            />"""

new_form = """                            <input
                                type="email"
                                class="form-input"
                                placeholder="Enter your email address"
                                required
                                style="flex: 1"
                            />
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-check"></i> Subscribe
                            </button>"""

content = content.replace(old_form, new_form)

with open(r'c:\Users\patil\Desktop\NEO\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Reverted button and input order.')
