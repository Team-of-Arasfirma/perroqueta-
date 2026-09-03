import CeramicHero from "@/components/Products/Ceramic/CeramicHero";
import CeramicOverview from "@/components/Products/Ceramic/CeramicOverview";
import CeramicApplications from "@/components/Products/Ceramic/CeramicApplications";
import CeramicSpecifications from "@/components/Products/Ceramic/CeramicSpecifications";

export const metadata = {
  title: "Ceramic Roofing Tiles",
  description:
    "Explore Perroqueta ceramic roofing tiles for residential and architectural roofing applications.",
};

export default function CeramicRoofingTilesPage() {
  return (
    <main className="bg-white">
      <CeramicHero />
      <CeramicOverview />
      <CeramicApplications />
      <CeramicSpecifications />
    </main>
  );
}