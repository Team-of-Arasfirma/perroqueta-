import WPCHero from "@/components/Products/WPC/WPCHero";
import WPCOverview from "@/components/Products/WPC/WPCOverview";
import WPCApplications from "@/components/Products/WPC/WPCApplications";
import WPCSpecifications from "@/components/Products/WPC/WPCSpecifications";

export const metadata = {
  title: "AKIMU WPC Interior Wall Panels",
  description:
    "Explore AKIMU WPC Interior Wall Panels from Perroqueta for modern interior applications.",
};

export default function WPCInteriorWallPanelsPage() {
  return (
    <main className="bg-white">
      <WPCHero />
      <WPCSpecifications />
      <WPCOverview />
      <WPCApplications />
      
    </main>
  );
}