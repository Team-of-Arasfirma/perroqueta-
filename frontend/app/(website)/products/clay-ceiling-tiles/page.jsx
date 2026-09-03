import ClayHero from "@/components/Products/Clay/ClayHero";
import ClayOverview from "@/components/Products/Clay/ClayOverview";
import ClayApplications from "@/components/Products/Clay/ClayApplications";
import ClaySpecifications from "@/components/Products/Clay/ClaySpecifications";

export const metadata = {
  title: "Clay Ceiling Tiles",
  description:
    "Explore Perroqueta clay ceiling tiles with natural red finish for interior and architectural applications.",
};

export default function ClayCeilingTilesPage() {
  return (
    <main className="bg-white">
      <ClayHero />
      <ClayOverview />
      <ClayApplications />
      <ClaySpecifications />
    </main>
  );
}