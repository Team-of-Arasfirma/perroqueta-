import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    title: "UPVC Roofing Sheets",
    image: "/assets/products/upv.png",
    description:
      "Corrosion-resistant and lightweight roofing sheets designed for long-term performance.",
    href: "/products/upvc-roofing-sheets",
  },
  {
    id: 2,
    title: "Stone Coated Roofing",
    image: "/assets/products/stone-coated.png",
    description:
      "Premium roofing solution combining elegant appearance with strength and weather resistance.",
    href: "/products/stone-coated-roofing",
  },
  {
    id: 3,
    title: "Ceramic Roofing Tiles",
    image: "/assets/products/ceramic.png",
    description:
      "Classic roofing tiles offering durability, aesthetics and low maintenance.",
    href: "/products/ceramic-roofing-tiles",
  },
  {
    id: 4,
    title: "AKIMU WPC Interior Wall Panels",
    image: "/assets/products/wpc/wpc-1.png",
    description:
      "Premium WPC interior wall panels by AKIMU, offering a stylish and durable finish for modern interiors.",
    href: "/products/wpc-interior-wall-panels",
  },
  {
    id: 5,
    title: "PUF Panels",
    image: "/assets/products/puf.png",
    description:
      "High-performance insulated panels designed for thermal efficiency and durability.",
    href: "/products/puf-panels",
  },
  {
    id: 6,
    title: "Clay Ceiling Tiles",
    image: "/assets/products/clay-ceiling.png",
    description:
      "Natural clay ceiling solutions that improve comfort and architectural character.",
    href: "/products/clay-ceiling-tiles",
  },
  {
    id: 7,
    title: "Terracotta Clay Jali",
    image: "/assets/products/terracotta-jali.png",
    description:
      "Architectural clay jali designed for ventilation, natural light and visual appeal.",
    href: "/products/terracotta-clay-jali",
  },
  {
    id: 8,
    title: "Solar Structures",
    image: "/assets/products/solar.png",
    description:
      "Strong structural solutions engineered for reliable solar installations.",
    href: "/products/solar-structures",
  },
];

export default function ProductGrid() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="mb-10">
          <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
            Product Range
          </p>

          <h2 className="mt-3 text-[28px] font-bold text-[#171717] sm:text-[34px]">
            Explore Our Solutions
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group overflow-hidden rounded-[16px] border border-[#EAEAEA] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-[220px] w-full overflow-hidden bg-[#F7F7F7]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-5">
                <h3 className="text-[19px] font-semibold text-[#171717] transition group-hover:text-[#6030C6]">
                  {product.title}
                </h3>

                <p className="mt-3 text-[14px] leading-6 text-[#666666]">
                  {product.description}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[#FF8626]">
                  View Product

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}