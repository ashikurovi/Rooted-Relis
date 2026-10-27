import { fetchApi } from './baseApi';

export const getAllFlashSells = async () => {
    const res = await fetchApi('/flashsell');
    return res.json();
};

export const getFlashSellById = async (id: number | string) => {
    const res = await fetchApi(`/flashsell/${id}`);
    return res.json();
};

export const createFlashSell = async (productData: any) => {
    const res = await fetchApi('/flashsell', {
        method: 'POST',
        body: JSON.stringify(productData),
    });
    return res.json();
};

export const updateFlashSell = async (
    id: number | string,
    productData: any
) => {
    const res = await fetchApi(`/flashsell/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(productData),
    });
    return res.json();
};

export const deleteFlashSell = async (id: number | string) => {
    const res = await fetchApi(`/flashsell/${id}`, {
        method: 'DELETE',
    });
    return res.json();
};