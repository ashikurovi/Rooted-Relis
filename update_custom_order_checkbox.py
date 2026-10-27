import os

filepath = 'src/app/(front)/main/custom-order/page.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Remove the old select block
old_select = """                {selectedCategory !== 'Corporate' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Print Options</label>
                    <select value={printOption} onChange={e => setPrintOption(e.target.value as any)} className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors rounded-md">
                      <option value="dtf">DTF Print (+৳60)</option>
                      <option value="a4">Custom Design A4 (+৳150)</option>
                    </select>
                  </div>
                )}
                
"""
content = content.replace(old_select, '')

# 2. Add the new radio checkbox cards at the bottom, before estimatedPrice
new_checkboxes = """                {selectedCategory !== 'Corporate' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Print Options</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className={`flex-1 border-[1px] p-4 rounded-md cursor-pointer transition-colors flex items-center gap-3 ${printOption === 'dtf' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                        <input type="radio" name="printOption" value="dtf" checked={printOption === 'dtf'} onChange={() => setPrintOption('dtf')} className="w-4 h-4 text-black focus:ring-black border-gray-300" />
                        <div>
                          <span className="block text-sm font-bold text-black uppercase tracking-tighter">DTF Print</span>
                          <span className="block text-xs font-medium text-gray-500">+৳60 per item</span>
                        </div>
                      </label>
                      <label className={`flex-1 border-[1px] p-4 rounded-md cursor-pointer transition-colors flex items-center gap-3 ${printOption === 'a4' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                        <input type="radio" name="printOption" value="a4" checked={printOption === 'a4'} onChange={() => setPrintOption('a4')} className="w-4 h-4 text-black focus:ring-black border-gray-300" />
                        <div>
                          <span className="block text-sm font-bold text-black uppercase tracking-tighter">Custom Design A4</span>
                          <span className="block text-xs font-medium text-gray-500">+৳150 per item</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                                {estimatedPrice > 0 && ("""
                                
content = content.replace('                                {estimatedPrice > 0 && (', new_checkboxes)

with open(filepath, 'w') as f:
    f.write(content)
