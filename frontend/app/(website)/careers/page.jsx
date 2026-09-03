import CareersHero from '@/components/Careers/CareersHero';
import OpenPositions from '@/components/Careers/OpenPositions';

export const metadata = {
  title: 'Careers',
  description: 'Explore career opportunities at Perroqueta and join our growing team in roofing, building materials and structural solutions.',
};

export default function CareersPage() {
  return <main className="bg-[#FBFBFB]"><CareersHero /><OpenPositions /></main>;
}
