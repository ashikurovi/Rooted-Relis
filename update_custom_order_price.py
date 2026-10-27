import os

filepath = 'src/app/(front)/main/custom-order/page.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Add estimatedPrice calculation
price_calc = """
  let estimatedPrice = 0;
  const qtyNum = Number(quantity) || 0;
  if (selectedPackage) {
    const pStr = String(selectedPackage.price).replace(/[^0-9.]/g, '');
    estimatedPrice = (Number(pStr) || 0) * qtyNum;
  } else if (selectedBaseItem) {
    const pStr = String(selectedBaseItem.price).replace(/[^0-9.]/g, '');
    const baseP = Number(pStr) || 0;
    estimatedPrice = (baseP + 60) * qtyNum;
  }
"""
content = content.replace('const handleCategoryChange = (category: string) => {', price_calc + '\n  const handleCategoryChange = (category: string) => {')

# 2. Add printInvoice function
print_fn = """
  const printInvoice = (orderData: any, estPrice: number) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>Custom Quote Invoice</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 40px; }
            .header h1 { margin: 0; text-transform: uppercase; letter-spacing: 2px; }
            .details { margin-bottom: 40px; }
            .details p { margin: 5px 0; font-size: 14px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .table th { background: #f9f9f9; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
            .total { text-align: right; font-size: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Custom Quote Request</h1>
          </div>
          <div class="details">
            <p><strong>Name:</strong> ${orderData.customerName}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
            <p><strong>Email:</strong> ${orderData.customerEmail}</p>
            <p><strong>Category:</strong> ${orderData.category}</p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Details</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${orderData.item}</td>
                <td>${orderData.quantity}</td>
                <td>${orderData.category === 'Corporate' ? 'Package Price' : 'Base Item + DTF Print (60 BDT)'}</td>
                <td>৳ ${estPrice.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Total Estimated: ৳ ${estPrice.toLocaleString()}
          </div>
          <p style="margin-top: 50px; font-size: 12px; color: #777;">Thank you for requesting a quote. Our team will contact you shortly to confirm the details and proceed with the order.</p>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };
"""
content = content.replace('const handleSubmit = async (e: React.FormEvent) => {', print_fn + '\n  const handleSubmit = async (e: React.FormEvent) => {')

# 3. Modify handleSubmit to call printInvoice
submit_replace = """      alert("Custom order requested successfully!");
      printInvoice({
        customerName,
        customerPhone,
        customerEmail: customerEmail || "Not provided",
        category: selectedCategory,
        item: itemStr,
        quantity: Number(quantity)
      }, estimatedPrice);"""
content = content.replace('alert("Custom order requested successfully!");', submit_replace)


# 4. Insert estimated price UI just before the submit button
price_ui = """                {estimatedPrice > 0 && (
                  <div className="bg-gray-100 p-5 rounded-md flex justify-between items-center border-[1px] border-gray-200">
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-700">Estimated Total:</span>
                    <span className="text-xl font-black text-black">৳ {estimatedPrice.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-4">"""
content = content.replace('<div className="pt-4">', price_ui)

with open(filepath, 'w') as f:
    f.write(content)
