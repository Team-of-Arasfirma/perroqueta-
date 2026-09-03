import ContactHero from "@/components/Contact/ContactHero";
import ContactSection from "@/components/Contact/ContactSection";
import ContactMap from "@/components/Contact/ContactMap";
import DepotSection from "@/components/Contact/DepotSection";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Perroqueta for roofing, building material and project enquiries.",
};

export default function ContactPage() {
  return (
    <main className="bg-[#FBFBFB]">
      <ContactHero />
      <ContactSection />
      <DepotSection />
      <ContactMap />
    </main>
  );
}