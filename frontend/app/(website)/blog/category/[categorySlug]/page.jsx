import BlogCategoryPage from "@/components/Blog/BlogCategoryPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  return { title: categorySlug.replace(/-/g, " "), alternates: { canonical: `/blog/category/${categorySlug}` } };
}

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params;
  return <BlogCategoryPage categorySlug={categorySlug} />;
}

