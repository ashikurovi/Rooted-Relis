import { fetchApi } from './baseApi';

export const getAllCampaignNotices = async () => {
  const res = await fetchApi('/campaign-notice');
  return res.json();
};

export const getCampaignNoticeById = async (id: number | string) => {
  const res = await fetchApi(`/campaign-notice/${id}`);
  return res.json();
};

export const createCampaignNotice = async (data: any) => {
  const res = await fetchApi('/campaign-notice', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateCampaignNotice = async (id: number | string, data: any) => {
  const res = await fetchApi(`/campaign-notice/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteCampaignNotice = async (id: number | string) => {
  const res = await fetchApi(`/campaign-notice/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
