import { fetchApi } from './baseApi';

// Get all calculations
export const getAllCalculations = async () => {
  const res = await fetchApi('/calculator');
  return res.json();
};

// Get a single calculation by ID
export const getCalculationById = async (id: number | string) => {
  const res = await fetchApi(`/calculator/${id}`);
  return res.json();
};

// Create a new calculation
export const createCalculation = async (calculationData: any) => {
  const res = await fetchApi('/calculator', {
    method: 'POST',
    body: JSON.stringify(calculationData),
  });
  return res.json();
};

// Update a calculation
export const updateCalculation = async (id: number | string, calculationData: any) => {
  const res = await fetchApi(`/calculator/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(calculationData),
  });
  return res.json();
};

// Delete a calculation
export const deleteCalculation = async (id: number | string) => {
  const res = await fetchApi(`/calculator/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
