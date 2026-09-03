import SolarHero from "@/components/Products/Solar/SolarHero";
import SolarOverview from "@/components/Products/Solar/SolarOverview";
import SolarApplications from "@/components/Products/Solar/SolarApplications";
import SolarSpecifications from "@/components/Products/Solar/SolarSpecifications";

export const metadata = {
  title: "Solar Structures",
  description:
    "Explore Perroqueta rooftop and ground-mounted solar structure solutions.",
};

export default function SolarStructuresPage() {
  return (
    <main className="bg-white">
      <SolarHero />
      <SolarOverview />
      <SolarApplications />
      <SolarSpecifications />
    </main>
  );
}