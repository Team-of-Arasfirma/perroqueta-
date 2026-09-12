export const dynamic = "force-dynamic";

const SITE_URL = "https://perroqueta.com";

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const escapeXml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };

    return entities[character];
  });

const formatDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().split("T")[0];
};

export async function GET() {
  const urls = [
    {
      loc: `${SITE_URL}/blog`,
      lastmod: new Date().toISOString().split("T")[0],
      priority: "0.8",
    },
  ];

  const addedUrls = new Set([`${SITE_URL}/blog`]);

  try {
    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    ).replace(/\/+$/, "");

    const response = await fetch(
      `${apiBase}/api/blogs?published=true&limit=all`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`Blog API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.success !== true || !Array.isArray(data.blogs)) {
      throw new Error("Invalid blog API response");
    }

    for (const blog of data.blogs) {
      const isValidBlog =
        blog?.published === true &&
        blog.status === "Published" &&
        blog.robotsIndex !== false &&
        typeof blog.slug === "string" &&
        validSlug.test(blog.slug);

      if (!isValidBlog) {
        continue;
      }

      const blogUrl = `${SITE_URL}/blog/${blog.slug}`;

      if (addedUrls.has(blogUrl)) {
        continue;
      }

      const lastmod =
        formatDate(blog.updatedAt) ||
        formatDate(blog.publishDate) ||
        formatDate(blog.createdAt);

      urls.push({
        loc: blogUrl,
        lastmod,
        priority: "0.6",
      });

      addedUrls.add(blogUrl);
    }
  } catch (error) {
    console.error(
      "Blog sitemap: using /blog fallback:",
      error.message
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((item) => {
    return `  <url>
    <loc>${escapeXml(item.loc)}</loc>${
      item.lastmod
        ? `
    <lastmod>${escapeXml(item.lastmod)}</lastmod>`
        : ""
    }
    <priority>${item.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}