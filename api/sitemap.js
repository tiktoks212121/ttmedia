export default function handler(req, res) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://ttmedia.vercel.app/</loc>
    <lastmod>2025-10-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://ttmedia.vercel.app/tutorial</loc>
    <lastmod>2025-10-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://ttmedia.vercel.app/faq</loc>
    <lastmod>2025-10-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://ttmedia.vercel.app/contacto</loc>
    <lastmod>2025-10-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://ttmedia.vercel.app/privacidad</loc>
    <lastmod>2025-10-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://ttmedia.vercel.app/blog</loc>
    <lastmod>2025-10-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(sitemap);
}
