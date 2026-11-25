import ProductDetail from "@/components/Products/ProductDetail";
import { getProductMetadata, requirePublishedProduct } from "@/lib/publicProducts";
import TerracottaHero from "@/components/Products/Terracotta/TerracottaHero";
import TerracottaOverview from "@/components/Products/Terracotta/TerracottaOverview";
import TerracottaApplications from "@/components/Products/Terracotta/TerracottaApplications";
import TerracottaSpecifications from "@/components/Products/Terracotta/TerracottaSpecifications";

const slug = "terracotta-clay-jali";
const sections = {
  hero: TerracottaHero,
  overview: TerracottaOverview,
  specifications: TerracottaSpecifications,
  applications: TerracottaApplications,
};

export function generateMetadata() {
  return getProductMetadata(slug);
}

export default async function TerracottaClayJaliPage() {
  const product = await requirePublishedProduct(slug);

  return <ProductDetail product={product} sections={sections} originalSelector="options" />;
}
