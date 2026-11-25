import mongoose from "mongoose";

const { Schema } = mongoose;
const sub = (fields) => new Schema(fields, { _id: false });
const text = { type: String, required: true };
const order = { type: Number, required: true, min: 0, validate: Number.isInteger };
const media = sub({
  url: text,
  publicId: { type: String, default: "" },
  alt: String,
});
const row = sub({ label: text, value: text });
const iconCard = sub({ title: text, description: text, iconKey: text });
const assetCard = (description) => sub({
  title: text,
  ...(description && { description: text }),
  image: { type: media, required: true },
  order,
});
const listingCard = assetCard(true);
const option = sub({
  id: text,
  label: text,
  image: { type: media, required: true },
  thumbnail: media,
  color: String,
  pattern: String,
  design: String,
  size: String,
  thickness: String,
  profileId: String,
  displayOrder: order,
});
const profile = sub({
  id: text,
  label: text,
  thumbnail: media,
  colors: { type: [option], default: undefined },
  profileType: String,
  diagram: media,
  dimensions: String,
  width: String,
  length: String,
  thickness: String,
  coverage: String,
  application: String,
  measurements: { type: [row], default: undefined },
  displayOrder: order,
});
const section = { eyebrow: text, heading: text, description: text };
const sectionKeys = ["hero", "overview", "specifications", "applications"];

const productSchema = new Schema({
  name: text,
  slug: {
    ...text,
    unique: true,
    immutable: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
  brand: String,
  series: String,
  breadcrumbLabel: text,
  detailHeading: text,
  status: { type: String, enum: ["draft", "published", "archived"], required: true, default: "draft" },
  displayOrder: order,
  sectionOrder: {
    type: [{ type: String, enum: sectionKeys }],
    validate: {
      validator: (keys) => keys.length === sectionKeys.length &&
        new Set(keys).size === sectionKeys.length && keys[0] === "hero" &&
        keys.every((key) => sectionKeys.includes(key)),
      message: "Section order must start with hero and contain each supported section once.",
    },
  },
  cards: {
    listing: { type: listingCard, required: true },
    home: { type: assetCard(false), required: true },
    about: listingCard,
    footer: sub({ label: text, order }),
  },
  hero: {
    fixedImage: media,
    alt: String,
    badges: [String],
    selectorType: {
      type: String,
      enum: ["none", "options", "profileColors", "wpcFinishes"],
      required: true,
    },
    defaultOptionId: String,
    defaultProfileId: String,
    defaultColorId: String,
  },
  options: { type: [option], default: undefined },
  profiles: { type: [profile], default: undefined },
  selectedSpecifications: sub({
    eyebrow: text,
    heading: text,
    labels: [String],
    badgeLabels: [String],
  }),
  technicalProfile: sub({
    eyebrow: text,
    heading: text,
    descriptionTemplate: text,
  }),
  overview: {
    eyebrow: text,
    heading: text,
    paragraphs: [String],
    highlight: { type: sub(section), required: true },
    features: [iconCard],
  },
  specifications: { ...section, rows: [row] },
  applications: { ...section, items: [iconCard] },
  brochure: sub({ filePath: text }),
  seo: { metaTitle: text, metaDescription: text, canonical: String },
}, { timestamps: true, optimisticConcurrency: true });

productSchema.index({ status: 1, displayOrder: 1, slug: 1 });

function hasValidIds(items) {
  return items.every((item) => item?.id?.trim()) &&
    new Set(items.map((item) => item.id)).size === items.length;
}

productSchema.pre("validate", function validateSelections() {
  const options = this.options ?? [];
  const profiles = this.profiles ?? [];
  const profileIds = new Set(profiles.filter(Boolean).map((item) => item.id));
  const { selectorType, fixedImage, defaultOptionId, defaultProfileId, defaultColorId } = this.hero ?? {};

  if (!hasValidIds(options)) this.invalidate("options", "Option IDs must be unique and present.");
  if (!hasValidIds(profiles)) this.invalidate("profiles", "Profile IDs must be unique and present.");

  for (const [index, item] of profiles.entries()) {
    const colors = item?.colors ?? [];
    if (!hasValidIds(colors)) {
      this.invalidate(`profiles.${index}.colors`, "Color IDs must be unique and present within a profile.");
    }
    if (selectorType === "profileColors" && !colors.length) {
      this.invalidate(`profiles.${index}.colors`, "Each selectable profile needs at least one color.");
    }
  }

  for (const [index, item] of options.entries()) {
    if (item && (item.profileId || selectorType === "wpcFinishes") && !profileIds.has(item.profileId)) {
      this.invalidate(`options.${index}.profileId`, "Option must reference an existing profile.");
    }
  }

  const usesOptions = selectorType === "options" || selectorType === "wpcFinishes";
  if ((defaultOptionId != null || usesOptions) && !options.some((item) => item?.id && item.id === defaultOptionId)) {
    this.invalidate("hero.defaultOptionId", "Default option must reference an existing option.");
  }

  const defaultProfile = profiles.find((item) => item?.id && item.id === defaultProfileId);
  const usesProfileColors = selectorType === "profileColors";
  if ((defaultProfileId != null || usesProfileColors) && !defaultProfile) {
    this.invalidate("hero.defaultProfileId", "Default profile must reference an existing profile.");
  }
  if ((defaultColorId != null || usesProfileColors) &&
      !defaultProfile?.colors?.some((item) => item?.id && item.id === defaultColorId)) {
    this.invalidate("hero.defaultColorId", "Default color must exist in the default profile.");
  }
  if (selectorType === "none" && !fixedImage) {
    this.invalidate("hero.fixedImage", "A fixed hero requires an image.");
  }
});

export default mongoose.model("Product", productSchema);
