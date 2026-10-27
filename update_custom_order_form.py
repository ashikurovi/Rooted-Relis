import os

filepath = 'src/app/(front)/main/custom-order/page.tsx'
with open(filepath, 'r') as f:
    content = f.read()

target = """          {/* Right Side: Order Request Form */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 p-8 sm:p-10 border-[1px] border-gray-200 rounded-lg sticky top-24">
              <h3 className="text-2xl font-bold text-black uppercase tracking-tighter mb-4">Request a Quote</h3>"""

replacement = """          {/* Right Side: Order Request Form */}
          <div className="w-full lg:w-1/3">
            {(selectedBaseItem || selectedPackageId) ? (
            <div className="bg-gray-50 p-8 sm:p-10 border-[1px] border-gray-200 rounded-lg sticky top-24 animate-in fade-in duration-500">
              <h3 className="text-2xl font-bold text-black uppercase tracking-tighter mb-4">Request a Quote</h3>"""

content = content.replace(target, replacement)

target_end = """              </form>
            </div>
          </div>"""

replacement_end = """              </form>
            </div>
            ) : (
              <div className="bg-gray-50 p-8 sm:p-10 border-[1px] border-dashed border-gray-300 rounded-lg sticky top-24 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-gray-400">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 uppercase tracking-tighter mb-2">Select a Product</h3>
                <p className="text-sm font-medium text-gray-400 max-w-[250px]">Choose an apparel item, bottle, or corporate package from the left to request a custom quote.</p>
              </div>
            )}
          </div>"""

content = content.replace(target_end, replacement_end)

with open(filepath, 'w') as f:
    f.write(content)
