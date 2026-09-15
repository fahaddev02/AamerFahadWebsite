import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aamerfahad.pk';
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const [prodRes, catRes] = await Promise.all([
      fetch(`${API_URL}/products?limit=100`),
      fetch(`${API_URL}/categories`),
    ]);

    const prods = await prodRes.json();
    const cats = await catRes.json();

    if (prods.success && prods.data) {
      productRoutes = prods.data.map((p: any) => ({
        url: `${baseUrl}/product/${p.slug}`,
        lastModified: new Date(p.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }

    if (cats.success && cats.data) {
      categoryRoutes = cats.data.map((c: any) => ({
        url: `${baseUrl}/category/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
    }
  } catch (e) {
    console.error('Sitemap fetch error:', e);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

