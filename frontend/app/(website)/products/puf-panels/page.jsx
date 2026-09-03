import PUFHero from "@/components/Products/PUF/PUFHero";
import PUFOverview from "@/components/Products/PUF/PUFOverview";
import PUFApplications from "@/components/Products/PUF/PUFApplications";
import PUFSpecifications from "@/components/Products/PUF/PUFSpecifications";

export const metadata = {
  title: "PUF Panels",
  description:
    "Explore Perroqueta PUF Panels for insulated industrial, commercial and cold storage applications.",
};

export default function PUFPanelsPage() {
  return (
    <main className="bg-white">
      <PUFHero />
      <PUFSpecifications />
      <PUFOverview />
      <PUFApplications />
      
    </main>
  );
}