import { fetchApi } from './baseApi';

export const getAllBlogs = async () => {
  const res = await fetchApi('/blogs');
  return res.json();
};

export const getBlogById = async (id: number | string) => {
  const res = await fetchApi(`/blogs/${id}`);
  return res.json();
};

export const createBlog = async (blogData: any) => {
  const res = await fetchApi('/blogs', {
    method: 'POST',
    body: JSON.stringify(blogData),
  });
  return res.json();
};

export const updateBlog = async (id: number | string, blogData: any) => {
  const res = await fetchApi(`/blogs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(blogData),
  });
  return res.json();
};

export const deleteBlog = async (id: number | string) => {
  const res = await fetchApi(`/blogs/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
