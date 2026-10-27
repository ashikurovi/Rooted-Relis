import { fetchApi } from "./baseApi";

export const getFlashSells = async () => {
  try {
    const res = await fetchApi("/flashsell");
    const json = await res.json();
    return json.data || json || [];
  } catch (error) {
    console.error("Error fetching flash sells:", error);
    return [];
  }
};
