import { getProductCards } from "@/lib/publicProducts";
import { getPageMetadata } from "@/lib/pageSeo";
import AboutHero from "@/components/About/AboutHero";
import WhoWeAre from "@/components/About/WhoWeAre";
import OurStory from "@/components/About/OurStory";
import MissionVision from "@/components/About/MissionVision";
import WhyChooseAbout from "@/components/About/WhyChooseAbout";
import ProductExpertise from "@/components/About/ProductExpertise";
import IndustriesWeServe from "@/components/About/IndustriesWeServe";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return getPageMetadata('about');
}

export default async function AboutPage() {
  const products = await getProductCards("about");

  return (
    <main className="bg-[#FBF6F6]">
      <AboutHero />
      <WhoWeAre />
      <OurStory />
      <IndustriesWeServe />
      <MissionVision />
      <WhyChooseAbout />
      <ProductExpertise products={products} />
        
    </main>
  );
}