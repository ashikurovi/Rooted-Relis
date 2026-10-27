import { fetchApi } from './baseApi';

export const getAllBanners = async () => {
  const res = await fetchApi('/banners');
  return res.json();
};

export const getBannerById = async (id: number | string) => {
  const res = await fetchApi(`/banners/${id}`);
  return res.json();
};

export const createBanner = async (bannerData: any) => {
  const res = await fetchApi('/banners', {
    method: 'POST',
    body: JSON.stringify(bannerData),
  });
  return res.json();
};

export const updateBanner = async (id: number | string, bannerData: any) => {
  const res = await fetchApi(`/banners/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(bannerData),
  });
  return res.json();
};

export const deleteBanner = async (id: number | string) => {
  const res = await fetchApi(`/banners/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
