export const statuses = ["draft", "published", "archived"];
export const selectors = ["none", "options", "profileColors", "wpcFinishes"];
const sections = ["hero", "specifications", "overview", "applications"];
const iconKeys = [
  "Blocks", "BriefcaseBusiness", "Building2", "CloudSun", "Coffee", "Factory",
  "Home", "Hotel", "House", "LandPlot", "Landmark", "Leaf", "PanelsTopLeft",
  "ShieldCheck", "Snowflake", "Sparkles", "Store", "Sun", "SunMedium",
  "ThermometerSnowflake", "Tractor", "Trees", "UtensilsCrossed", "Volume2",
  "Warehouse", "Weight", "Wind", "Wrench", "Boxes",
];

const field = (key, label, config = {}) => ({ key, label, ...config });
const required = (key, label, config = {}) => field(key, label, { required: true, ...config });
const multiline = (key, label) => required(key, label, { type: "textarea" });
const number = (key, label) => required(key, label, { type: "number" });
const media = (key, label, required = false) => field(key, label, { type: "media", required });
const group = (key, label, fields, optional = false) => field(key, label, { type: "group", fields, optional });
const array = (key, label, itemLabel, fields, config = {}) =>
  field(key, label, { type: "array", itemLabel, fields, ...config });
const choices = (values) => values.map((value) => ({ value, label: value }));
const referenceChoices = (items = []) => items.filter((item) => item?.id).map(({ id, label }) =>
  ({ value: id, label: label ? `${label} (${id})` : id }));
const tableRows = [required("label", "Label"), required("value", "Value", { type: "textarea" })];
const headingFields = [required("eyebrow", "Eyebrow"), required("heading", "Heading")];
const sectionFields = [...headingFields, multiline("description", "Description")];
const iconCard = [
  required("title", "Title"),
  multiline("description", "Description"),
  required("iconKey", "Icon Key", { type: "select", options: () => choices(iconKeys) }),
];

const optionFields = [
  required("id", "ID"), required("label", "Label"),
  media("image", "Image", true), media("thumbnail", "Thumbnail"),
  field("color", "Color"), field("pattern", "Pattern"), field("design", "Design"),
  field("size", "Size"), field("thickness", "Thickness"),
  field("profileId", "Profile reference", {
    type: "select", options: (product) => referenceChoices(product.profiles ?? []),
  }),
  number("displayOrder", "Display Order"),
];

function cardFields(description) {
  return [
    required("title", "Title"),
    ...(description ? [multiline("description", "Description")] : []),
    media("image", "Image", true),
    number("order", "Order"),
  ];
}

export const productSections = [
  { title: "Basic Details", fields: [
    required("name", "Product Name"),
    required("slug", "Slug", { immutable: true }),
    field("brand", "Brand"), field("series", "Series"),
    required("breadcrumbLabel", "Breadcrumb Label"), required("detailHeading", "Detail Heading"),
    required("status", "Status", { type: "select", options: () => choices(statuses) }),
    number("displayOrder", "Display Order"),
  ] },
  { title: "Cards & Footer", fields: [
    group("cards", "Product placements", [
      group("listing", "Listing Card", cardFields(true)),
      group("home", "Home Card", cardFields(false)),
      group("about", "About Card", cardFields(true), true),
      group("footer", "Footer", [required("label", "Label"), number("order", "Order")], true),
    ]),
  ] },
  { title: "Hero", fields: [
    group("hero", "Hero settings", [
      field("alt", "Hero Alt Text"),
      required("selectorType", "Selector Type", { type: "select", options: () => [
        { value: "none", label: "Fixed image" },
        { value: "options", label: "Options" },
        { value: "profileColors", label: "Profile colors" },
        { value: "wpcFinishes", label: "WPC finishes" },
      ] }),
      media("fixedImage", "Fixed Hero Image"),
      array("badges", "Hero Badges", "Badge", null),
      field("defaultOptionId", "Default Option", {
        type: "select", options: (product) => referenceChoices(product.options ?? []),
      }),
      field("defaultProfileId", "Default Profile", {
        type: "select", options: (product) => referenceChoices(product.profiles ?? []),
      }),
      field("defaultColorId", "Default Color", {
        type: "select", options: (product) =>
          referenceChoices(product.profiles?.find(({ id }) => id === product.hero?.defaultProfileId)?.colors ?? []),
      }),
    ]),
  ] },
  { title: "Variants / Options", fields: [array("options", "Options", "Option", optionFields, { ordered: true })] },
  { title: "Profiles", fields: [array("profiles", "Profiles", "Profile", [
    required("id", "ID"), required("label", "Label"), number("displayOrder", "Display Order"),
    field("profileType", "Profile Type"),
    media("thumbnail", "Thumbnail"), media("diagram", "Diagram"),
    ...["Dimensions", "Width", "Length", "Thickness", "Coverage", "Application"].map((label) =>
      field(label.toLowerCase(), label)),
    array("measurements", "Measurements", "Measurement", tableRows),
    array("colors", "Profile Colors", "Color", optionFields, { ordered: true }),
  ], { ordered: true })] },
  { title: "Overview & Features", fields: [group("overview", "Overview", [
    ...headingFields,
    array("paragraphs", "Paragraphs", "Paragraph", null, { multiline: true }),
    group("highlight", "Highlight", sectionFields),
    array("features", "Features", "Feature", iconCard),
  ])] },
  { title: "Specifications", fields: [group("specifications", "Specifications", [
    ...sectionFields, array("rows", "Specification Rows", "Row", tableRows),
  ])] },
  { title: "Applications", fields: [group("applications", "Applications", [
    ...sectionFields, array("items", "Application Items", "Application", iconCard),
  ])] },
  { title: "Technical Display", fields: [
    group("selectedSpecifications", "Selected Specifications", [
      ...headingFields, array("labels", "Row Labels", "Row Label", null),
      array("badgeLabels", "Badge Labels", "Badge Label", null),
    ], true),
    group("technicalProfile", "Technical Profile", [
      ...headingFields, multiline("descriptionTemplate", "Description Template"),
    ], true),
    array("sectionOrder", "Page Section Order", "Section", null, { fixed: true, choices: sections }),
  ] },
  { title: "SEO", fields: [group("seo", "Search metadata", [
    required("metaTitle", "Meta Title", { guidance: "50–60", type: "count" }),
    required("metaDescription", "Meta Description", { guidance: "150–160", type: "count", multiline: true }),
    field("canonical", "Canonical URL"),
  ])] },
  { title: "Brochure", fields: [
    group("brochure", "Product Brochure", [required("filePath", "File Path")], true),
  ] },
];

export function createDraft() {
  return {
    status: "draft", displayOrder: 0, sectionOrder: [...sections],
    cards: { listing: { order: 0 }, home: { order: 0 } },
    hero: { selectorType: "none", badges: [] },
    overview: { paragraphs: [], highlight: {}, features: [] },
    specifications: { rows: [] }, applications: { items: [] }, seo: {},
  };
}

export function productContent(record) {
  const { _id, __v, createdAt, updatedAt, ...fields } = record;
  // Keep metadata out of the editable payload while preserving every nested field.
  return { fields, metadata: { _id, __v, createdAt, updatedAt } };
}

export function isProductImageUrl(url) {
  if (typeof url !== "string" || !url) return false;
  if (url.startsWith("/assets/")) return true;
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

export function matchesProduct(product, query, status) {
  const term = query.trim().toLowerCase();
  return (!status || product.status === status) &&
    [product.name, product.slug].some((value) => value.toLowerCase().includes(term));
}

export function moveItem(items, from, to) {
  if (to < 0 || to >= items.length || from === to) return items;
  const result = [...items];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

function validateFields(fields, value, prefix, errors) {
  for (const config of fields) {
    const item = value?.[config.key];
    const path = `${prefix} / ${config.label}`;
    if (config.type === "group") {
      if (item != null || !config.optional) validateFields(config.fields, item, path, errors);
    } else if (config.type === "array") {
      if (config.fields) item?.forEach((entry, index) =>
        validateFields(config.fields, entry, `${path} ${index + 1}`, errors));
    } else if (config.type === "media") {
      if ((config.required || item != null) && !isProductImageUrl(item?.url)) {
        errors.push(`${path} needs a local asset path or HTTP(S) image URL.`);
      }
    } else if (config.type === "number") {
      if (!Number.isInteger(item) || item < 0) errors.push(`${path} must be a non-negative integer.`);
    } else if (config.required && !item?.trim()) {
      errors.push(`${path} is required.`);
    }
  }
}

function ids(items, label, errors) {
  const values = items.map((item) => item.id);
  if (new Set(values).size !== values.length) errors.push(`${label} IDs must be unique.`);
  return new Set(values.filter((id) => id?.trim()));
}

export function validateProduct(product) {
  const errors = [];
  for (const section of productSections) validateFields(section.fields, product, section.title, errors);

  const { slug, status, sectionOrder, hero = {}, options = [], profiles = [] } = product;
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push("Slug must use lowercase letters, numbers, and single hyphens.");
  }
  if (!statuses.includes(status)) errors.push("Choose a valid status.");
  if (!selectors.includes(hero.selectorType)) errors.push("Choose a valid selector type.");
  if (sectionOrder?.[0] !== "hero" || sectionOrder.length !== sections.length ||
      !sections.every((section) => sectionOrder.includes(section))) {
    errors.push("Page section order must start with hero and include all four sections once.");
  }

  const optionIds = ids(options ?? [], "Option", errors);
  const profileIds = ids(profiles ?? [], "Profile", errors);
  const selectedProfile = profiles?.find((profile) => profile.id === hero.defaultProfileId);
  const requiresOption = ["options", "wpcFinishes"].includes(hero.selectorType);
  const requiresColors = hero.selectorType === "profileColors";
  const usesWpc = hero.selectorType === "wpcFinishes";

  if (hero.selectorType === "none" && !hero.fixedImage?.url?.trim()) errors.push("A fixed hero requires an image URL.");
  if ((requiresOption || hero.defaultOptionId) && !optionIds.has(hero.defaultOptionId)) {
    errors.push("Choose a default option from the current options.");
  }
  if ((requiresColors || hero.defaultProfileId) && !selectedProfile) {
    errors.push("Choose a default profile from the current profiles.");
  }
  if ((requiresColors || hero.defaultColorId) &&
      !selectedProfile?.colors?.some(({ id }) => id && id === hero.defaultColorId)) {
    errors.push("Choose a default color from the default profile.");
  }

  for (const profile of profiles ?? []) {
    const colors = profile.colors ?? [];
    ids(colors, `Profile ${profile.label || profile.id || "(unnamed)"} color`, errors);
    if (requiresColors && !colors.length) {
      errors.push(`Profile ${profile.label || profile.id || "(unnamed)"} needs at least one color.`);
    }
  }
  for (const option of options ?? []) {
    if ((usesWpc || option.profileId) && !profileIds.has(option.profileId)) {
      errors.push(`Option ${option.label || option.id || "(unnamed)"} must reference an existing profile.`);

    }
  }
  for (const profile of profiles ?? []) {
    if (usesWpc &&
        (!profile.diagram?.url?.trim() || !profile.measurements?.length)) {
      errors.push(`WPC profile ${profile.label || profile.id} needs a diagram and at least one measurement.`);
    }
  }
  return errors;
}
