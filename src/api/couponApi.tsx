import { fetchApi } from './baseApi';

export const getAllCoupons = async () => {
  const res = await fetchApi('/coupons');
  return res.json();
};

export const getCouponById = async (id: number | string) => {
  const res = await fetchApi(`/coupons/${id}`);
  return res.json();
};

export const validateCoupon = async (code: string, subtotal: number) => {
  const res = await fetchApi('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal }),
  });
  return res.json();
};

export const createCoupon = async (couponData: any) => {
  const res = await fetchApi('/coupons', {
    method: 'POST',
    body: JSON.stringify(couponData),
  });
  return res.json();
};

export const updateCoupon = async (id: number | string, couponData: any) => {
  const res = await fetchApi(`/coupons/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(couponData),
  });
  return res.json();
};

export const deleteCoupon = async (id: number | string) => {
  const res = await fetchApi(`/coupons/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
