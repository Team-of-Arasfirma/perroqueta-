import ProductDetail from "@/components/Products/ProductDetail";
import { getProductMetadata, requirePublishedProduct } from "@/lib/publicProducts";
import SolarHero from "@/components/Products/Solar/SolarHero";
import SolarOverview from "@/components/Products/Solar/SolarOverview";
import SolarApplications from "@/components/Products/Solar/SolarApplications";
import SolarSpecifications from "@/components/Products/Solar/SolarSpecifications";

const slug = "solar-structures";
const sections = {
  hero: SolarHero,
  overview: SolarOverview,
  specifications: SolarSpecifications,
  applications: SolarApplications,
};

export function generateMetadata() {
  return getProductMetadata(slug);
}

export default async function SolarStructuresPage() {
  const product = await requirePublishedProduct(slug);

  return <ProductDetail product={product} sections={sections} originalSelector="none" />;
}
