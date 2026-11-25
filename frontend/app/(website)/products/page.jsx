import { getProductCards } from "@/lib/publicProducts";
import { getPageMetadata } from "@/lib/pageSeo";
import ProductHero from "@/components/Products/ProductHero";
import ProductGrid from "@/components/Products/ProductGrid";

const fallbackMetadata = {
  title: "Products",
  description:
    "Explore Perroqueta roofing, wall, clay and structural product solutions.",
};

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return getPageMetadata('products', fallbackMetadata);
}

export default async function ProductsPage() {
  const products = await getProductCards("listing");

  return (
    <main className="bg-[#FBFBFB]">
      <ProductHero />
      <ProductGrid products={products} />
    </main>
  );
}   