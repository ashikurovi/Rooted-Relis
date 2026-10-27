import { fetchApi } from './baseApi';

export const getAllBudgetPicks = async () => {
    const res = await fetchApi('/budget-pick');
    return res.json();
};

export const getBudgetPickById = async (id: number | string) => {
    const res = await fetchApi(`/budget-pick/${id}`);
    return res.json();
};

export const createBudgetPick = async (productData: any) => {
    const res = await fetchApi('/budget-pick', {
        method: 'POST',
        body: JSON.stringify(productData),
    });
    return res.json();
};

export const updateBudgetPick = async (
    id: number | string,
    productData: any
) => {
    const res = await fetchApi(`/budget-pick/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(productData),
    });
    return res.json();
};

export const deleteBudgetPick = async (id: number | string) => {
    const res = await fetchApi(`/budget-pick/${id}`, {
        method: 'DELETE',
    });
    return res.json();
};
