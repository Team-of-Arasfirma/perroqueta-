import StoneCoatedDetails from "@/components/Products/Stone/StoneCoatedDetails";
import StoneCoatedOverview from "@/components/Products/Stone/StoneCoatedOverview";
import StoneCoatedApplications from "@/components/Products/Stone/StoneCoatedApplications";
import StoneCoatedSpecifications from "@/components/Products/Stone/StoneCoatedSpecifications";

export const metadata = {
  title: "Stone Coated Roofing",
  description:
    "Explore Perroqueta stone coated roofing sheets available in multiple profiles and colors.",
};

export default function StoneCoatedRoofingPage() {
  return (
    <main className="bg-white">
      <StoneCoatedDetails />
      <StoneCoatedSpecifications />
      <StoneCoatedOverview />
      <StoneCoatedApplications />
      
    </main>
  );
}