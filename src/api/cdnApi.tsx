import { fetchApi } from './baseApi';

// Upload an image file to the CDN
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetchApi('/cdn/upload', {
    method: 'POST',
    body: formData,
  });
  
  return res.json();
};
