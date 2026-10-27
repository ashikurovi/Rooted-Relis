"use client";

import { useState, useEffect, useMemo } from "react";
import { Calculator, TrendingUp, DollarSign, Percent, Plus, X, Trash2 } from "lucide-react";
import { getAllCalculations, createCalculation, updateCalculation, deleteCalculation } from "../../../api/calculatorApi";

export default function CalculationPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newItem, setNewItem] = useState({
    name: "", quantity: 1, buyingPrice: 0, designCost: 0, additionalCost: 0, sellingPrice: 0
  });

  useEffect(() => {
    fetchCalculations();
  }, []);

  const fetchCalculations = async () => {
    try {
      const data = await getAllCalculations();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch calculations", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: number, field: string, value: number) => {
    const updatedValue = Number(value);
    
    // Optimistic UI update
    setProducts(products.map(p => p.id === id ? { ...p, [field]: updatedValue } : p));
    
    try {
      await updateCalculation(id, { [field]: updatedValue });
    } catch (error) {
      console.error("Failed to update calculation", error);
      // Revert on error could be added here
      fetchCalculations();
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    
    try {
      const createdItem = await createCalculation(newItem);
      setProducts([...products, createdItem]);
      setNewItem({ name: "", quantity: 1, buyingPrice: 0, designCost: 0, additionalCost: 0, sellingPrice: 0 });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add calculation", error);
    }
  };

  const removeProduct = async (id: number) => {
    try {
      await deleteCalculation(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete calculation", error);
    }
  };

  // Calculations
  const calcData = useMemo(() => {
    let totalExpectedProfit = 0;
    let totalCostValue = 0;
    let totalRevenueValue = 0;

    const rows = products.map(p => {
      const qty = Number(p.quantity) || 1;
      const buyingPrice = Number(p.buyingPrice) || 0;
      const designCost = Number(p.designCost) || 0;
      const additionalCost = Number(p.additionalCost) || 0;
      const sellingPrice = Number(p.sellingPrice) || 0;

      const unitCost = buyingPrice + designCost + additionalCost;
      const unitProfit = sellingPrice - unitCost;
      
      const rowTotalCost = unitCost * qty;
      const rowTotalRevenue = sellingPrice * qty;
      const rowTotalProfit = unitProfit * qty;
      const margin = sellingPrice > 0 ? ((unitProfit / sellingPrice) * 100).toFixed(2) : "0.00";
      
      totalExpectedProfit += rowTotalProfit;
      totalCostValue += rowTotalCost;
      totalRevenueValue += rowTotalRevenue;

      return { ...p, unitCost, rowTotalCost, rowTotalRevenue, rowTotalProfit, margin };
    });

    const avgMargin = totalRevenueValue > 0 ? ((totalExpectedProfit / totalRevenueValue) * 100).toFixed(2) : "0.00";

    return { rows, totalExpectedProfit, totalCostValue, totalRevenueValue, avgMargin };
  }, [products]);

  if (isLoading) {
    return <div className="p-8 flex justify-center text-gray-500">Loading calculations...</div>;
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">Profit & Cost Calculator</h1>
          <p className="text-black font-bold uppercase mt-1">Calculate volume based costs, expenses, and expected total profits.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#3b82f6] text-white px-6 py-2 text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none flex flex-col gap-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <h3 className="text-sm font-medium tracking-tight">Total Capital Required</h3>
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold">৳ {calcData.totalCostValue.toLocaleString()}</div>
        </div>
        
        <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none flex flex-col gap-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <h3 className="text-sm font-medium tracking-tight">Total Expected Revenue</h3>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">৳ {calcData.totalRevenueValue.toLocaleString()}</div>
        </div>

        <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none flex flex-col gap-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <h3 className="text-sm font-medium tracking-tight">Total Expected Profit</h3>
            <Calculator className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">৳ {calcData.totalExpectedProfit.toLocaleString()}</div>
        </div>

        <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none flex flex-col gap-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <h3 className="text-sm font-medium tracking-tight">Avg. Profit Margin</h3>
            <Percent className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{calcData.avgMargin}%</div>
        </div>
      </div>

      {/* Main Calculator Table */}
      <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-x-auto w-full">
        <table className="w-full text-sm text-left">
          <thead className="bg-black text-white font-medium border-b border-gray-900 dark:border-gray-800 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-4 min-w-[200px]">Product Name</th>
              <th className="px-3 py-3 w-[80px]">Qty</th>
              <th className="px-3 py-3 w-[100px]">Buy/Unit(৳)</th>
              <th className="px-3 py-3 w-[100px]">Design(৳)</th>
              <th className="px-3 py-3 w-[100px]">Extra(৳)</th>
              <th className="px-4 py-4 w-[110px]">Unit Cost(৳)</th>
              <th className="px-4 py-4 w-[120px] text-red-500">Total Capital(৳)</th>
              <th className="px-3 py-3 w-[110px]">Sell/Unit(৳)</th>
              <th className="px-4 py-4 w-[120px] text-blue-500">Total Sell(৳)</th>
              <th className="px-4 py-4 w-[120px]">Total Profit(৳)</th>
              <th className="px-4 py-4 w-[80px]">Margin</th>
              <th className="px-3 py-3 w-[50px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {calcData.rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="px-4 py-4 font-medium">{row.name}</td>
                <td className="px-3 py-2">
                  <input 
                    type="number" 
                    value={row.quantity || ""} 
                    onChange={(e) => handleUpdate(row.id, 'quantity', Number(e.target.value))}
                    className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none p-1.5 bg-blue-50 dark:bg-blue-900/20 dark:border-gray-700 font-bold text-blue-700 dark:text-blue-400 text-sm" 
                  />
                </td>
                <td className="px-3 py-2">
                  <input 
                    type="number" 
                    value={row.buyingPrice || ""} 
                    onChange={(e) => handleUpdate(row.id, 'buyingPrice', Number(e.target.value))}
                    className="w-full border-b border-gray-300 focus:border-gray-900 focus:outline-none p-1.5 bg-transparent dark:border-gray-700 dark:focus:border-gray-100 text-sm" 
                  />
                </td>
                <td className="px-3 py-2">
                  <input 
                    type="number" 
                    value={row.designCost || ""} 
                    onChange={(e) => handleUpdate(row.id, 'designCost', Number(e.target.value))}
                    className="w-full border-b border-gray-300 focus:border-gray-900 focus:outline-none p-1.5 bg-transparent dark:border-gray-700 dark:focus:border-gray-100 text-sm" 
                  />
                </td>
                <td className="px-3 py-2">
                  <input 
                    type="number" 
                    value={row.additionalCost || ""} 
                    onChange={(e) => handleUpdate(row.id, 'additionalCost', Number(e.target.value))}
                    className="w-full border-b border-gray-300 focus:border-gray-900 focus:outline-none p-1.5 bg-transparent dark:border-gray-700 dark:focus:border-gray-100 text-sm" 
                  />
                </td>
                <td className="px-4 py-4 font-bold bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300">
                  {row.unitCost.toLocaleString()}
                </td>
                <td className="px-4 py-4 font-bold bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400">
                  {row.rowTotalCost.toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <input 
                    type="number" 
                    value={row.sellingPrice || ""} 
                    onChange={(e) => handleUpdate(row.id, 'sellingPrice', Number(e.target.value))}
                    className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none p-1.5 bg-transparent dark:border-gray-700 font-bold text-gray-900 dark:text-gray-100 text-sm" 
                  />
                </td>
                <td className="px-4 py-4 font-bold bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400">
                  {row.rowTotalRevenue.toLocaleString()}
                </td>
                <td className="px-4 py-4 font-bold bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400">
                  {row.rowTotalProfit.toLocaleString()}
                </td>
                <td className="px-4 py-4 font-bold bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400">
                  {row.margin}%
                </td>
                <td className="px-3 py-3 text-center">
                  <button onClick={() => removeProduct(row.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {calcData.rows.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  No products added. Add a product to start calculating.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none w-full max-w-md">
            <div className="flex items-center justify-between border-b-4 border-black p-4 mb-2">
              <h3 className="text-lg font-black uppercase text-black">Add Product to Calculate</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Product Name</label>
                <input 
                  type="text" required
                  value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-900 dark:border-gray-700 rounded-sm" 
                  placeholder="e.g. Summer T-Shirt"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Quantity</label>
                  <input 
                    type="number" required min={1}
                    value={newItem.quantity || ""} onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                    className="w-full border border-blue-300 bg-blue-50 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 dark:bg-blue-900/20 dark:border-blue-700 rounded-sm font-bold text-blue-700 dark:text-blue-300" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">Buy / Production (৳)</label>
                  <input 
                    type="number" required min={0}
                    value={newItem.buyingPrice || ""} onChange={(e) => setNewItem({...newItem, buyingPrice: Number(e.target.value)})}
                    className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-900 dark:border-gray-700 rounded-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">Design Cost (৳)</label>
                  <input 
                    type="number" required min={0}
                    value={newItem.designCost || ""} onChange={(e) => setNewItem({...newItem, designCost: Number(e.target.value)})}
                    className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-900 dark:border-gray-700 rounded-sm" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">Extra Costs (৳)</label>
                  <input 
                    type="number" required min={0}
                    value={newItem.additionalCost || ""} onChange={(e) => setNewItem({...newItem, additionalCost: Number(e.target.value)})}
                    className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-900 dark:border-gray-700 rounded-sm" 
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5 border-t pt-4 mt-2 dark:border-gray-800">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Selling Price / Unit (৳)</label>
                <input 
                  type="number" required min={0}
                  value={newItem.sellingPrice || ""} onChange={(e) => setNewItem({...newItem, sellingPrice: Number(e.target.value)})}
                  className="w-full border border-gray-400 p-2.5 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-gray-600 dark:bg-gray-900 dark:border-gray-600 rounded-sm" 
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="border-2 border-black bg-white px-6 py-2 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all text-black rounded-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#3b82f6] text-white px-6 py-2 text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

