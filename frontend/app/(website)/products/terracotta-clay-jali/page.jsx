import TerracottaHero from "@/components/Products/Terracotta/TerracottaHero";
import TerracottaOverview from "@/components/Products/Terracotta/TerracottaOverview";
import TerracottaApplications from "@/components/Products/Terracotta/TerracottaApplications";
import TerracottaSpecifications from "@/components/Products/Terracotta/TerracottaSpecifications";

export const metadata = {
  title: "Terracotta Clay Jali",
  description:
    "Explore Perroqueta Terracotta Clay Jali for architectural screens, facades and decorative applications.",
};

export default function TerracottaClayJaliPage() {
  return (
    <main className="bg-white">
      <TerracottaHero />
      <TerracottaOverview />
      <TerracottaApplications />
      <TerracottaSpecifications />
    </main>
  );
}