import ProductHero from "@/components/Products/ProductHero";
import ProductGrid from "@/components/Products/ProductGrid";

export const metadata = {
  title: "Products",
  description:
    "Explore Perroqueta roofing, wall, clay and structural product solutions.",
};

export default function ProductsPage() {
  return (
    <main className="bg-[#FBFBFB]">
      <ProductHero />
      <ProductGrid />
    </main>
  );
}   