import os

filepath = 'src/app/(front)/main/custom-order/page.tsx'
with open(filepath, 'r') as f:
    content = f.read()

target = """            <p><strong>Category:</strong> ${orderData.category}</p>
          </div>"""

replacement = """            <p><strong>Category:</strong> ${orderData.category}</p>
            <p><strong>Status:</strong> <span style="background: #333; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase;">New Request</span></p>
          </div>"""

content = content.replace(target, replacement)

with open(filepath, 'w') as f:
    f.write(content)
