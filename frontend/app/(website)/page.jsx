import styles from "./home.module.css";
import HeroSection from "@/components/Home/HeroSection";
import StatsBanner from "@/components/Home/StatsBanner";
import ProductsSection from "@/components/Home/ProductsSection";
import WhyChooseSection from "@/components/Home/WhyChooseSection";
import ProjectsSection from "@/components/Home/ProjectsSection";
import ProjectStats from "@/components/Home/ProjectStats";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import BlogSection from "@/components/Home/BlogSection";

export default function HomePage() {
  return (
    <div className={styles.home} data-home-page>
      <HeroSection />
      <StatsBanner />
      <ProductsSection />
      <WhyChooseSection />
      <ProjectsSection />
      <ProjectStats />
      <TestimonialsSection />
      <BlogSection />
    </div>
  );
}