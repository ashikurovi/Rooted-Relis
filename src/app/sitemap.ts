import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rootedrelish.com';

  const routes: MetadataRoute.Sitemap = [
    '',
    '/main/shop',
    '/main/blogs',
    '/main/big-sale',
    '/main/budget-pick',
    '/main/pre-order',
    '/main/custom-order',
    '/main/terms-and-conditions',
    '/main/refund-returns',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const res = await fetch('https://api.codegrid.shop/products', {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const products = data?.data || data || [];
      if (Array.isArray(products)) {
        products.forEach((product: any) => {
          if (product?.id) {
            routes.push({
              url: `${baseUrl}/main/product/${product.id}`,
              lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  try {
    const res = await fetch('https://codegrid-api.vercel.app/blogs', {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const blogs = data?.data || data || [];
      if (Array.isArray(blogs)) {
        blogs.forEach((blog: any) => {
          if (blog?.id) {
            routes.push({
              url: `${baseUrl}/main/blogs/${blog.id}`,
              lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.6,
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch blogs for sitemap:', error);
  }

  return routes;
}
