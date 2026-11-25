import ProductDetail from "@/components/Products/ProductDetail";
import ProductOverview from "@/components/Products/upvc/ProductOverview";
import ProductSpecifications from "@/components/Products/upvc/ProductSpecifications";
import ProductApplications from "@/components/Products/upvc/ProductApplications";
import { getProductMetadata, requirePublishedProduct } from "@/lib/publicProducts";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return getProductMetadata(slug);
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await requirePublishedProduct(slug);
  const sections = {
    overview: ProductOverview,
    specifications: ProductSpecifications,
    applications: ProductApplications,
  };

  return <ProductDetail product={product} sections={sections} />;
}
