import ProductDetail from "@/components/Products/ProductDetail";
import { getProductMetadata, requirePublishedProduct } from "@/lib/publicProducts";
import WPCHero from "@/components/Products/WPC/WPCHero";
import WPCOverview from "@/components/Products/WPC/WPCOverview";
import WPCApplications from "@/components/Products/WPC/WPCApplications";
import WPCSpecifications from "@/components/Products/WPC/WPCSpecifications";

const slug = "wpc-interior-wall-panels";
const sections = {
  hero: WPCHero,
  overview: WPCOverview,
  specifications: WPCSpecifications,
  applications: WPCApplications,
};

export function generateMetadata() {
  return getProductMetadata(slug);
}

export default async function WPCInteriorWallPanelsPage() {
  const product = await requirePublishedProduct(slug);

  return <ProductDetail product={product} sections={sections} originalSelector="wpcFinishes" />;
}
