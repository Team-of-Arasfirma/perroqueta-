export const BLOG_CATEGORIES = [
  'General',
  'UPVC Roofing',
  'Stone Coated Roofing',
  'Ceramic Roofing Tiles',
  'WPC',
  'PUF Panels',
  'Clay Products',
  'Terracotta',
  'Solar Structures',
  'Roofing',
  'Installation',
  'Industry News',
];

export const BLOG_CATEGORY_OPTIONS = BLOG_CATEGORIES.map((label) => ({
  label,
  value: label,
  slug: label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-'),
}));
