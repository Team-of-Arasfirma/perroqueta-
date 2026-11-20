import { getPageMetadata } from "@/lib/pageSeo";
import ProjectHero from "@/components/Project/ProjectHero";
import ProjectShowcase from "@/components/Project/ProjectShowcase";

const fallbackMetadata = {
  title: "Projects",
  description:
    "Explore roofing, building materials and structural projects completed by Perroqueta.",
};

export function generateMetadata() {
  return getPageMetadata('project', fallbackMetadata);
}

export default function ProjectsPage() {
  return (
    <main className="bg-[#FBFBFB]">
      <ProjectHero />
      <ProjectShowcase />
    </main>
  );
}