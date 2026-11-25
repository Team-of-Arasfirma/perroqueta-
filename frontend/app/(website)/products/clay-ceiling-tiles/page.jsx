import ProductDetail from "@/components/Products/ProductDetail";
import { getProductMetadata, requirePublishedProduct } from "@/lib/publicProducts";
import ClayHero from "@/components/Products/Clay/ClayHero";
import ClayOverview from "@/components/Products/Clay/ClayOverview";
import ClayApplications from "@/components/Products/Clay/ClayApplications";
import ClaySpecifications from "@/components/Products/Clay/ClaySpecifications";

const slug = "clay-ceiling-tiles";
const sections = {
  hero: ClayHero,
  overview: ClayOverview,
  specifications: ClaySpecifications,
  applications: ClayApplications,
};

export function generateMetadata() {
  return getProductMetadata(slug);
}

export default async function ClayCeilingTilesPage() {
  const product = await requirePublishedProduct(slug);

  return <ProductDetail product={product} sections={sections} originalSelector="none" />;
}
