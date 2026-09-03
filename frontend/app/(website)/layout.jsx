import Navbar from "@/components/Navbar";
import FooterCTA from "@/components/FooterCTA";
import Footer from "@/components/Footer";

export default function WebsiteLayout({ children }) {
  return (
    <>
      

      <Navbar />

      <main>
        {children}
      </main>

      <FooterCTA />
      <Footer />
    </>
  );
}