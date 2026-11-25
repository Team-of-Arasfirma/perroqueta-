import ProductDetail from "@/components/Products/ProductDetail";
import { getProductMetadata, requirePublishedProduct } from "@/lib/publicProducts";
import UPVCHero from "@/components/Products/upvc/UPVCHero";
import ProductOverview from "@/components/Products/upvc/ProductOverview";
import ProductApplications from "@/components/Products/upvc/ProductApplications";
import ProductSpecifications from "@/components/Products/upvc/ProductSpecifications";

const slug = "upvc-roofing-sheets";
const sections = {
  hero: UPVCHero,
  overview: ProductOverview,
  specifications: ProductSpecifications,
  applications: ProductApplications,
};

export function generateMetadata() {
  return getProductMetadata(slug);
}

export default async function UPVCRoofingSheetsPage() {
  const product = await requirePublishedProduct(slug);

  return <ProductDetail product={product} sections={sections} originalSelector="options" />;
}
