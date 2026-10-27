"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { createOrder } from "@/api/orderApi";
import { createIncompleteOrder, updateIncompleteOrder, deleteIncompleteOrder } from "@/api/incompleteOrderApi";
import { updateUser } from "@/api/userApi";
import { loginUser } from "@/api/authApi";
import { validateCoupon } from "@/api/couponApi";

const getDeviceId = () => {
  const storageKey = "codegrid_device_id";
  const existingId = localStorage.getItem(storageKey);
  if (existingId) return existingId;

  const newId = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(storageKey, newId);
  return newId;
};

const getDeviceLocation = () => new Promise<string>((resolve) => {
  if (!navigator.geolocation) {
    resolve("Not available");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`),
    () => resolve("Permission not granted"),
    { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 },
  );
});

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [shippingMethod, setShippingMethod] = useState("INSIDE_DHAKA");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    district: "",
    phone: "+880",
    email: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccessUser, setOrderSuccessUser] = useState<{ id: number, email: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [settingPassword, setSettingPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const incompleteOrderIdRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setFormData(prev => ({
          ...prev,
          fullName: parsedUser.name || prev.fullName,
          phone: parsedUser.phone || prev.phone,
          email: parsedUser.email || prev.email,
          address: parsedUser.deliveryaddress || prev.address,
          district: parsedUser.district || parsedUser.city || parsedUser.division || prev.district,
        }));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || items.length === 0) return;

    const timeoutId = setTimeout(async () => {
      // Capture if we have at least phone or name to identify the cart
      if (formData.phone.length > 4 || formData.fullName.trim() !== "") {
        const orderData = {
          customerName: formData.fullName,
          customerEmail: formData.email || undefined,
          customerPhone: formData.phone,
          selectedProducts: items.map(item => ({
            productId: Number(item.id),
            quantity: Number(item.quantity),
            productName: item.title,
          })),
        };

        try {
          if (incompleteOrderIdRef.current) {
            await updateIncompleteOrder(incompleteOrderIdRef.current, orderData);
          } else {
            const res = await createIncompleteOrder(orderData);
            if (res && res.id) {
              incompleteOrderIdRef.current = res.id;
            }
          }
        } catch (error) {
          console.error("Failed to save incomplete order:", error);
        }
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, items, mounted]);


  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderSuccessUser || !newPassword) return;

    try {
      setSettingPassword(true);
      // Update the user's password
      await updateUser(orderSuccessUser.id, { password: newPassword });

      // Log them in
      await loginUser({ email: orderSuccessUser.email, password: newPassword });

      alert("Password set successfully! Redirecting to dashboard...");
      window.location.href = "/main/dashboard"; // Navigate and force reload to update auth state
    } catch (error) {
      console.error("Failed to set password:", error);
      alert("Failed to set password. You can try resetting it later.");
      router.push("/main/shop");
    } finally {
      setSettingPassword(false);
    }
  };

  const shippingOptions = [
    { id: "INSIDE_DHAKA", label: "Inside Dhaka", cost: 65 },
    { id: "OUTSIDE_DHAKA", label: "Outside Dhaka", cost: 115 },
    { id: "DHAKA_SUBURBS", label: "Dhaka Suburbs", cost: 85 },
  ];

  if (!mounted) return null;

  const selectedShippingCost = shippingOptions.find(opt => opt.id === shippingMethod)?.cost || 0;
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmountBeforeCoupon = subtotal + selectedShippingCost;
  const totalAmount = Math.max(0, totalAmountBeforeCoupon - couponDiscount);

  const handleCouponApply = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      setCouponMessage("");
      return;
    }

    try {
      const res = await validateCoupon(couponCode.trim(), subtotal);
      if (!res?.data?.valid && !res?.valid) {
        setCouponApplied(false);
        setCouponDiscount(0);
        setCouponError(res?.data?.message || res?.message || "Coupon is invalid.");
        setCouponMessage("");
        return;
      }

      const discountValue = Number(res?.data?.discount ?? res?.discount ?? 0);
      setCouponDiscount(discountValue);
      setCouponApplied(true);
      setCouponError("");
      setCouponMessage(`Coupon applied successfully. You saved ৳${discountValue}.`);
    } catch (error) {
      console.error("Coupon validation failed", error);
      setCouponApplied(false);
      setCouponDiscount(0);
      setCouponError("Failed to validate coupon. Please try again.");
      setCouponMessage("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const location = await getDeviceLocation();
    const orderData = {
      items: items.map(item => ({
        productId: Number(item.id),
        quantity: Number(item.quantity)
      })),
      shippingAddress: `${formData.fullName}\n${formData.address}\n${formData.district}\nPhone: ${formData.phone}\nEmail: ${formData.email}`,
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      paymentMethod: paymentMethod === 'COD' ? 'COD' : 'Bkash',
      deliveryType: shippingMethod,
      deliveryFee: Number(selectedShippingCost),
      orderNotes: formData.notes,
      totalAmount: Number(totalAmount),
      status: items.some(item => item.isPreOrder) ? "Pre Order" : "Pending",
      isPreOrder: items.some(item => item.isPreOrder),
      deviceId: getDeviceId(),
      device: navigator.userAgent,
      location,
      couponCode: couponApplied ? couponCode.trim() : undefined,
      discountAmount: couponApplied ? Number(couponDiscount) : 0,
    };

    try {
      setLoading(true);
      const res = await createOrder(orderData);
      if (res) {
        if (incompleteOrderIdRef.current) {
          try {
            await deleteIncompleteOrder(incompleteOrderIdRef.current);
          } catch (e) {
            console.error("Failed to clear incomplete order", e);
          }
        }

        const isGuestCheckout = !localStorage.getItem("user");
        if (isGuestCheckout && res.data?.user?.id && formData.email) {
          setOrderSuccessUser({ id: res.data.user.id, email: formData.email });
          clearCart();
          return;
        }

        alert("Order placed successfully!");
        clearCart();
        router.push("/main/shop");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccessUser) {
    return (
      <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border-[1px] border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6 text-sm">
            We&apos;ve created an account for you with the email <strong>{orderSuccessUser.email}</strong>.
            Set a password below to track your orders and manage your account.
          </p>

          <form onSubmit={handleSetPassword} className="flex flex-col gap-4 text-left">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-[1px] border-gray-300 p-3 text-sm rounded-md focus:border-black outline-none transition-colors"
                placeholder="Enter a secure password"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={settingPassword}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {settingPassword ? "Setting Password..." : "Set Password & Go to Dashboard"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/main/shop")}
              className="w-full bg-gray-100 text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors mt-2"
            >
              Skip for now
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Form */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div>
              <h2 className="text-lg font-semibold mb-6 pb-2 border-b-[1px] border-gray-200 text-black">
                Billing & Shipping Details
              </h2>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full border-[1px] border-gray-300 bg-transparent p-3 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="address" className="text-sm font-semibold text-gray-700">Full Address *</label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your full address with thana and district name"
                    className="w-full border-[1px] border-gray-300 bg-transparent p-3 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="district" className="text-sm font-semibold text-gray-700">District(জেলা) *</label>
                  <input
                    type="text"
                    id="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="District name (for Dhaka, area; ex. Banani)"
                    className="w-full border-[1px] border-gray-300 bg-transparent p-3 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+88"
                    className="w-full border-[1px] border-gray-300 bg-transparent p-3 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address (Optional)</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full border-[1px] border-gray-300 bg-transparent p-3 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="mt-2">
              <h2 className="text-lg font-semibold mb-6 pb-2 border-b-[1px] border-gray-200 text-black">
                Additional Information
              </h2>
              <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="text-sm font-semibold text-gray-700">Order Notes (Optional)</label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  className="w-full border-[1px] border-gray-300 bg-transparent p-3 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Receipt / Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white border-[1px] border-gray-200 shadow-sm p-6 sm:p-8 rounded-xl sticky top-24">

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-6 text-black">Order Summary</h3>

                <div className="flex flex-col gap-4">
                  {items.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex gap-4 items-center pb-4 border-b-[1px] border-gray-100 last:border-b-0 last:pb-0">
                      <div className="relative w-16 h-16 bg-gray-50 rounded-lg border-[1px] border-gray-200 overflow-visible shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image.startsWith('http') ? item.image : `https://codegrid-api.vercel.app${item.image.startsWith('/') ? '' : '/'}${item.image}`} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-[10px] text-gray-400 font-medium">NO IMG</span>
                        )}
                        <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-[2px] border-white shadow-sm z-10">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <span className="font-semibold text-sm text-black line-clamp-2 leading-tight mb-1">{item.title}</span>
                        {item.size && <span className="text-xs text-gray-500 font-medium">Size: {item.size}</span>}
                      </div>

                      <span className="font-semibold text-sm text-black mt-1">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="text-sm font-medium text-red-500 py-4 text-center bg-red-50 rounded-lg">Your cart is empty.</div>
                  )}
                </div>
              </div>

              <div className="mb-6 border-b-[1px] border-gray-100 pb-6">
                <span className="block font-semibold text-sm text-black mb-3">Coupon</span>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="w-full border-[1px] border-gray-300 bg-white p-3 text-sm font-medium text-black focus:outline-none focus:border-black rounded-md"
                    />
                    <button type="button" onClick={handleCouponApply} className="bg-black text-white px-4 py-3 text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap">
                      Apply
                    </button>
                  </div>
                  {couponMessage && <p className="text-sm text-green-600">{couponMessage}</p>}
                  {couponError && <p className="text-sm text-red-600">{couponError}</p>}
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm text-gray-600 border-t-[1px] border-gray-100 pt-6">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">৳{subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className="font-medium text-black">{selectedShippingCost > 0 ? `৳${selectedShippingCost}` : 'Select shipping'}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-৳{couponDiscount}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 border-b-[1px] border-gray-100 pb-6">
                <span className="block font-semibold text-sm text-black mb-3">Shipping Method</span>
                <div className="flex flex-col gap-2">
                  {shippingOptions.map((option) => (
                    <label key={option.id} className={`flex items-center justify-between p-3 cursor-pointer rounded-lg border-[1px] transition-colors ${shippingMethod === option.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                          checked={shippingMethod === option.id}
                          onChange={() => setShippingMethod(option.id)}
                        />
                        <span className={`text-sm font-medium ${shippingMethod === option.id ? 'text-black' : 'text-gray-700'}`}>
                          {option.label}
                        </span>
                      </div>
                      <span className="font-semibold text-sm text-black">৳{option.cost}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6 border-b-[1px] border-gray-100 pb-6">
                <span className="block font-semibold text-sm text-black mb-3">Payment Method</span>
                <label className={`flex items-start gap-3 p-3 cursor-pointer rounded-lg border-[1px] transition-colors ${paymentMethod === 'COD' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    className="mt-0.5 w-4 h-4 text-black border-gray-300 focus:ring-black"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${paymentMethod === 'COD' ? 'text-black' : 'text-gray-700'}`}>Cash On Delivery</span>
                    {paymentMethod === 'COD' && (
                      <span className="text-xs text-gray-500 mt-1 font-medium">Pay with cash upon delivery.</span>
                    )}
                  </div>
                </label>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-base font-medium text-gray-600 mb-1">Total</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-500 font-medium">BDT</span>
                  <span className="text-3xl font-bold text-black tracking-tight">৳{totalAmount}</span>
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-black border-gray-300 rounded-sm focus:ring-black transition-colors" required />
                  <span className="text-xs font-medium text-gray-500 leading-relaxed select-none">
                    I agree to the website&apos;s <Link href="/main/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-black underline hover:no-underline font-semibold">terms and conditions</Link> *
                  </span>
                </label>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#106840] hover:bg-[#0D4B2D]'} text-white font-bold text-base py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md shadow-[#106840]/20 hover:scale-[1.01]`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Complete Order"
                )}
              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
