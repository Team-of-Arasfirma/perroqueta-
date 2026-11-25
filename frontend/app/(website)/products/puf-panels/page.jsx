import ProductDetail from "@/components/Products/ProductDetail";
import { getProductMetadata, requirePublishedProduct } from "@/lib/publicProducts";
import PUFHero from "@/components/Products/PUF/PUFHero";
import PUFOverview from "@/components/Products/PUF/PUFOverview";
import PUFApplications from "@/components/Products/PUF/PUFApplications";
import PUFSpecifications from "@/components/Products/PUF/PUFSpecifications";

const slug = "puf-panels";
const sections = {
  hero: PUFHero,
  overview: PUFOverview,
  specifications: PUFSpecifications,
  applications: PUFApplications,
};

export function generateMetadata() {
  return getProductMetadata(slug);
}

export default async function PUFPanelsPage() {
  const product = await requirePublishedProduct(slug);

  return <ProductDetail product={product} sections={sections} originalSelector="options" />;
}
