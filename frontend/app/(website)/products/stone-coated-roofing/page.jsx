import ProductDetail from "@/components/Products/ProductDetail";
import { getProductMetadata, requirePublishedProduct } from "@/lib/publicProducts";
import StoneCoatedDetails from "@/components/Products/Stone/StoneCoatedDetails";
import StoneCoatedOverview from "@/components/Products/Stone/StoneCoatedOverview";
import StoneCoatedApplications from "@/components/Products/Stone/StoneCoatedApplications";
import StoneCoatedSpecifications from "@/components/Products/Stone/StoneCoatedSpecifications";
import {
  StoneCoatedCardSection,
  StoneCoatedTextSection,
} from "@/components/Products/Stone/StoneCoatedContent";
import content from "@/components/Products/Stone/stoneCoatedContent.json";

const slug = "stone-coated-roofing";

const coveredOverviewFeatures = new Set([
  "Long-Lasting Protection",
  "Weather Resistant",
  "Premium Appearance",
]);
const coveredApplications = new Set([
  "Residential Homes",
  "Resorts & Hotels",
  "Commercial Buildings",
  "Institutional Projects",
]);

function Overview({ product }) {
  const overview = {
    ...product.overview,
    features: product.overview.features.filter((item) => !coveredOverviewFeatures.has(item.title)),
  };

  return (
    <>
      <StoneCoatedOverview product={{ overview }} />
      <StoneCoatedTextSection content={content.intro} />
      <StoneCoatedCardSection content={content.features} />
      <StoneCoatedTextSection content={content.manufacturer} />
      <StoneCoatedCardSection content={content.process} />
    </>
  );
}

function Applications({ product }) {
  const applications = {
    ...product.applications,
    heading: content.applications.heading,
    items: [
      ...content.applications.items,
      ...product.applications.items.filter((item) => !coveredApplications.has(item.title)),
    ],
  };

  return (
    <>
      <StoneCoatedApplications product={{ applications }} />
      <StoneCoatedTextSection content={content.benefits} shaded />
      <StoneCoatedTextSection content={content.contact} />
    </>
  );
}

const sections = {
  hero: StoneCoatedDetails,
  overview: Overview,
  specifications: StoneCoatedSpecifications,
  applications: Applications,
};

export function generateMetadata() {
  return getProductMetadata(slug);
}

export default async function StoneCoatedRoofingPage() {
  const product = await requirePublishedProduct(slug);

  return <ProductDetail product={product} sections={sections} originalSelector="profileColors" />;
}
