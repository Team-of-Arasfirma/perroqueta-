import ProjectHero from "@/components/Project/ProjectHero";
import ProjectShowcase from "@/components/Project/ProjectShowcase";

export const metadata = {
  title: "Projects",
  description:
    "Explore roofing, building materials and structural projects completed by Perroqueta.",
};

export default function ProjectsPage() {
  return (
    <main className="bg-[#FBFBFB]">
      <ProjectHero />
      <ProjectShowcase />
    </main>
  );
}