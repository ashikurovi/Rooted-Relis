import os

filepath = 'src/app/(front)/main/custom-order/page.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Add printOption state
state_target = 'const [details, setDetails] = useState("");'
state_replace = 'const [details, setDetails] = useState("");\n  const [printOption, setPrintOption] = useState<"dtf" | "a4">("dtf");'
content = content.replace(state_target, state_replace)

# Update estimatedPrice calculation
price_calc_old = """  let estimatedPrice = 0;
  const qtyNum = Number(quantity) || 0;
  if (selectedPackage) {
    const pStr = String(selectedPackage.price).replace(/[^0-9.]/g, '');
    estimatedPrice = (Number(pStr) || 0) * qtyNum;
  } else if (selectedBaseItem) {
    const pStr = String(selectedBaseItem.price).replace(/[^0-9.]/g, '');
    const baseP = Number(pStr) || 0;
    estimatedPrice = (baseP + 60) * qtyNum;
  }"""
  
price_calc_new = """  let estimatedPrice = 0;
  const qtyNum = Number(quantity) || 0;
  if (selectedPackage) {
    const pStr = String(selectedPackage.price).replace(/[^0-9.]/g, '');
    estimatedPrice = (Number(pStr) || 0) * qtyNum;
  } else if (selectedBaseItem) {
    const pStr = String(selectedBaseItem.price).replace(/[^0-9.]/g, '');
    const baseP = Number(pStr) || 0;
    const printCost = printOption === "a4" ? 150 : 60;
    estimatedPrice = (baseP + printCost) * qtyNum;
  }"""
content = content.replace(price_calc_old, price_calc_new)

# Update HTML form
form_old = """                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Phone <span className="text-red-500">*</span></label>
                    <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md" placeholder="+880..." />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Qty <span className="text-red-500">*</span></label>
                    <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value) || "")} required className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md" placeholder="Min. 10" />
                  </div>
                </div>"""
                
form_new = """                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Phone <span className="text-red-500">*</span></label>
                    <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md" placeholder="+880..." />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Qty <span className="text-red-500">*</span></label>
                    <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value) || "")} required className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md" placeholder="Min. 10" />
                  </div>
                </div>

                {selectedCategory !== 'Corporate' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Print Options</label>
                    <select value={printOption} onChange={e => setPrintOption(e.target.value as any)} className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors rounded-md">
                      <option value="dtf">DTF Print (+৳60)</option>
                      <option value="a4">Custom Design A4 (+৳150)</option>
                    </select>
                  </div>
                )}"""
content = content.replace(form_old, form_new)

# Update Invoice HTML
invoice_old = """                <td>${orderData.category === 'Corporate' ? 'Package Price' : 'Base Item + DTF Print (60 BDT)'}</td>"""
invoice_new = """                <td>${orderData.category === 'Corporate' ? 'Package Price' : 'Base Item + Print Cost (' + (printOption === "a4" ? "150 BDT" : "60 BDT") + ')'}</td>"""
content = content.replace(invoice_old, invoice_new)

with open(filepath, 'w') as f:
    f.write(content)
