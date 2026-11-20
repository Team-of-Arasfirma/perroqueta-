import { getPageMetadata } from "@/lib/pageSeo";
import ProductHero from "@/components/Products/ProductHero";
import ProductGrid from "@/components/Products/ProductGrid";

const fallbackMetadata = {
  title: "Products",
  description:
    "Explore Perroqueta roofing, wall, clay and structural product solutions.",
};

export function generateMetadata() {
  return getPageMetadata('products', fallbackMetadata);
}

export default function ProductsPage() {
  return (
    <main className="bg-[#FBFBFB]">
      <ProductHero />
      <ProductGrid />
    </main>
  );
}   