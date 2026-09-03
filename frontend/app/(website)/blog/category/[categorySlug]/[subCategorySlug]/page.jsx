import BlogCategoryPage from "@/components/Blog/BlogCategoryPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { categorySlug, subCategorySlug } = await params;
  return { title: subCategorySlug.replace(/-/g, " "), alternates: { canonical: `/blog/category/${categorySlug}/${subCategorySlug}` } };
}

export default async function SubCategoryPage({ params }) {
  const { categorySlug, subCategorySlug } = await params;
  return <BlogCategoryPage categorySlug={categorySlug} subCategorySlug={subCategorySlug} />;
}

