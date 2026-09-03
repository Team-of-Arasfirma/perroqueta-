import UPVCHero from "@/components/Products/upvc/UPVCHero";
import ProductOverview from "@/components/Products/upvc/ProductOverview";
import ProductApplications from "@/components/Products/upvc/ProductApplications";
import ProductSpecifications from "@/components/Products/upvc/ProductSpecifications";

export const metadata = {
  title: "UPVC Roofing Sheets",
  description:
    "Explore Perroqueta UPVC roofing sheets available in multiple colours and standard dimensions.",
};

export default function UPVCRoofingSheetsPage() {
  return (
    <main className="bg-white">
      <UPVCHero />
      <ProductSpecifications />
      <ProductOverview />
      <ProductApplications />
      
    </main>
  );
}