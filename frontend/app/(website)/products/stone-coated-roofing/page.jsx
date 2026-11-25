import ProductDetail from "@/components/Products/ProductDetail";
import { getProductMetadata, requirePublishedProduct } from "@/lib/publicProducts";
import StoneCoatedDetails from "@/components/Products/Stone/StoneCoatedDetails";
import StoneCoatedOverview from "@/components/Products/Stone/StoneCoatedOverview";
import StoneCoatedApplications from "@/components/Products/Stone/StoneCoatedApplications";
import StoneCoatedSpecifications from "@/components/Products/Stone/StoneCoatedSpecifications";

const slug = "stone-coated-roofing";
const sections = {
  hero: StoneCoatedDetails,
  overview: StoneCoatedOverview,
  specifications: StoneCoatedSpecifications,
  applications: StoneCoatedApplications,
};

export function generateMetadata() {
  return getProductMetadata(slug);
}

export default async function StoneCoatedRoofingPage() {
  const product = await requirePublishedProduct(slug);

  return <ProductDetail product={product} sections={sections} originalSelector="profileColors" />;
}
