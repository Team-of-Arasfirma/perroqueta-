import { getPageMetadata } from "@/lib/pageSeo";
import CareersHero from '@/components/Careers/CareersHero';
import OpenPositions from '@/components/Careers/OpenPositions';

const fallbackMetadata = {
  title: 'Careers',
  description: 'Explore career opportunities at Perroqueta and join our growing team in roofing, building materials and structural solutions.',
};

export function generateMetadata() {
  return getPageMetadata('careers', fallbackMetadata);
}

export default function CareersPage() {
  return <main className="bg-[#FBFBFB]"><CareersHero /><OpenPositions /></main>;
}
