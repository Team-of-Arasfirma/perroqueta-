import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarDays, Clock3, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import CareerApplicationTrigger from '@/components/Careers/CareerApplicationTrigger';
import { fetchCareerBySlug } from '@/services/careerService';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { career } = await fetchCareerBySlug(slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return { title: career.metaTitle || career.title, description: career.metaDescription || career.shortDescription || career.title, alternates: { canonical: `${siteUrl}/careers/${career.slug}` } };
  } catch { return { title: 'Career Opportunity' }; }
}

const dateLabel = (value) => value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'Open until filled';

export default async function CareerDetailPage({ params }) {
  const { slug } = await params;
  let career;
  try { career = (await fetchCareerBySlug(slug)).career; } catch { notFound(); }
  const description = career.description?.split(/\n+/).filter(Boolean) || [];
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'JobPosting', title: career.title, description: career.description,
    datePosted: career.publishedAt || career.createdAt, validThrough: career.applicationDeadline || undefined,
    employmentType: career.jobType?.toUpperCase().replaceAll(' ', '_'), hiringOrganization: { '@type': 'Organization', name: 'Perroqueta' },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: career.location } },
  };
  return <main className="bg-[#FBFBFB]">
    <section className="bg-[#17112D] px-5 py-16 text-white sm:py-24"><div className="mx-auto max-w-[1120px]"><Link href="/careers" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"><ArrowLeft className="h-4 w-4" /> All careers</Link><p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-[#FF8626]">{career.department}</p><h1 className="mt-4 max-w-4xl text-4xl font-bold sm:text-6xl">{career.title}</h1><div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75"><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#FF8626]" />{career.location}</span><span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-[#FF8626]" />{career.jobType}</span><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#FF8626]" />{career.workMode}</span></div></div></section>
    <section className="mx-auto grid max-w-[1120px] gap-10 px-5 py-14 lg:grid-cols-[1fr_330px]"><article className="rounded-3xl bg-white p-6 shadow-sm sm:p-10"><p className="text-lg leading-8 text-[#555]">{career.shortDescription}</p><h2 className="mt-10 text-2xl font-bold text-[#171717]">About the role</h2><div className="mt-4 space-y-4 leading-8 text-[#666]">{description.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>{[['Responsibilities', career.responsibilities], ['Requirements', career.requirements]].map(([heading, items]) => items?.length ? <section key={heading} className="mt-10"><h2 className="text-2xl font-bold text-[#171717]">{heading}</h2><ul className="mt-4 space-y-3 text-[#666]">{items.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FF8626]" />{item}</li>)}</ul></section> : null)}{career.skills?.length ? <section className="mt-10"><h2 className="text-2xl font-bold text-[#171717]">Skills</h2><div className="mt-4 flex flex-wrap gap-2">{career.skills.map((skill) => <span key={skill} className="rounded-full bg-[#F0EAFB] px-3 py-2 text-xs font-semibold text-[#6030C6]">{skill}</span>)}</div></section> : null}</article><aside className="h-fit rounded-3xl bg-white p-6 shadow-sm sm:p-7"><h2 className="text-xl font-bold text-[#171717]">Job summary</h2><div className="mt-6 space-y-5 text-sm text-[#666]"><p><span className="block text-xs font-bold uppercase text-[#999]">Experience</span><strong className="mt-1 block text-[#333]">{career.experience || 'Not specified'}</strong></p><p><span className="block text-xs font-bold uppercase text-[#999]">Openings</span><strong className="mt-1 flex items-center gap-2 text-[#333]"><Users className="h-4 w-4 text-[#FF8626]" />{career.openings}</strong></p><p><span className="block text-xs font-bold uppercase text-[#999]">Apply by</span><strong className="mt-1 flex items-center gap-2 text-[#333]"><CalendarDays className="h-4 w-4 text-[#FF8626]" />{dateLabel(career.applicationDeadline)}</strong></p>{career.salary ? <p><span className="block text-xs font-bold uppercase text-[#999]">Salary</span><strong className="mt-1 block text-[#333]">{career.salary}</strong></p> : null}</div><CareerApplicationTrigger career={career} /></aside></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}
