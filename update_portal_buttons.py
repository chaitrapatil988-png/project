import re

with open(r'c:\Users\patil\Desktop\NEO\portal.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update forms to redirect to 404
content = re.sub(r'<form id="hashSearchForm"[^>]*>', r'<form id="hashSearchForm" class="hash-search-group" onsubmit="window.location.href=\'404.html\'; return false;">', content)

content = re.sub(r'<form id="logHoursForm"[^>]*>', r'<form id="logHoursForm" class="auth-form" style="gap:16px;" onsubmit="window.location.href=\'404.html\'; return false;">', content)

# Update Download Tax Receipt button
content = re.sub(r'<button id="downloadReceiptBtn"([^>]*)>', r'<button id="downloadReceiptBtn"\1 onclick="window.location.href=\'404.html\'">', content)

with open(r'c:\Users\patil\Desktop\NEO\portal.html', 'w', encoding='utf-8') as f:
    f.write(content)
