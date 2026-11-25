import { cache } from "react";
import { notFound } from "next/navigation";

const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/products";

async function request(path = "") {
  const response = await fetch(api + path, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (path && response.status === 404) return null;
  if (!response.ok) throw new Error(`Product API returned HTTP ${response.status}`);
  return response.json();
}

const fetchProduct = cache(async (slug) => {
  const result = await request("/slug/" + encodeURIComponent(slug));
  if (!result) return null;
  if (result.product?.slug !== slug || result.product.status !== "published") {
    throw new Error("Product API returned an unexpected product");
  }
  return result.product;
});

export async function requirePublishedProduct(slug) {
  const product = await fetchProduct(slug);
  if (!product) notFound();
  return product;
}

export async function getProductMetadata(slug) {
  const { seo, name, cards } = await requirePublishedProduct(slug);
  return {
    title: seo?.metaTitle || name,
    description: seo?.metaDescription || cards.listing.description,
    alternates: { canonical: seo?.canonical || "/products/" + slug },
  };
}

export async function getProductCards(surface) {
  try {
    const { products } = await request();
    return products
      .filter((product) => product.status === "published" && product.cards?.[surface])
      .map(({ slug, cards }) => {
        const { title, description, image, order } = cards[surface];
        return { slug, title, description, image: image.url, alt: image.alt || title, order, href: "/products/" + slug };
      })
      .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  } catch (error) {
    console.error("Could not load published product cards", error);
    return [];
  }
}
