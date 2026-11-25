import ProductDetail from "@/components/Products/ProductDetail";
import { getProductMetadata, requirePublishedProduct } from "@/lib/publicProducts";
import CeramicHero from "@/components/Products/Ceramic/CeramicHero";
import CeramicOverview from "@/components/Products/Ceramic/CeramicOverview";
import CeramicApplications from "@/components/Products/Ceramic/CeramicApplications";
import CeramicSpecifications from "@/components/Products/Ceramic/CeramicSpecifications";

const slug = "ceramic-roofing-tiles";
const sections = {
  hero: CeramicHero,
  overview: CeramicOverview,
  specifications: CeramicSpecifications,
  applications: CeramicApplications,
};

export function generateMetadata() {
  return getProductMetadata(slug);
}

export default async function CeramicRoofingTilesPage() {
  const product = await requirePublishedProduct(slug);

  return <ProductDetail product={product} sections={sections} originalSelector="options" />;
}
