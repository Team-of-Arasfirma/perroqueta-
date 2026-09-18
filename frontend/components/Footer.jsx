import Image from "next/image";
import Link from "next/link";

import {
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Products", href: "/products" },
  { label: "Project", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

const products = [
  {
    label: "UPVC Roofing Solutions",
    href: "/products/upvc-roofing-sheets",
  },
  {
    label: "Stone Coated Roofing",
    href: "/products/stone-coated-roofing",
  },
  {
    label: "Ceramic Roofing Tiles",
    href: "/products/ceramic-roofing-tiles",
  },
  {
    label: "WPC Interior Wall Panels",
    href: "/products/wpc-interior-wall-panels",
  },
  {
    label: "PUF Panels",
    href: "/products/puf-panels",
  },
  {
    label: "Clay Ceiling Tiles",
    href: "/products/clay-ceiling-tiles",
  },
  {
    label: "Terracotta Clay Jali",
    href: "/products/terracotta-clay-jali",
  },
  {
    label: "Solar Structures",
    href: "/products/solar-structures",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#121047]">
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-6 pt-10 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_1.2fr_1.35fr_1.35fr]">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="relative block h-[68px] w-[230px]"
            >
              <Image
                src="/assets/logo/Perroqueta-white.png"
                alt="Perroqueta"
                fill
                sizes="230px"
                className="object-contain object-left"
              />
            </Link>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://wa.me/919514077787"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition duration-300 hover:border-[#FF8A22] hover:bg-[#FF8A22] hover:text-white"
              >
                <FaWhatsapp size={18} />
              </a>

              <a
                href="https://www.instagram.com/perroqueta_roofings/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition duration-300 hover:border-[#FF8A22] hover:bg-[#FF8A22] hover:text-white"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://www.facebook.com/p/Perroqueta-61573143764726/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition duration-300 hover:border-[#FF8A22] hover:bg-[#FF8A22] hover:text-white"
              >
                <FaFacebookF size={17} />
              </a>

              <a
                href="https://www.youtube.com/@Perroqueta"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition duration-300 hover:border-[#FF8A22] hover:bg-[#FF8A22] hover:text-white"
              >
                <FaYoutube size={19} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[20px] font-medium text-white">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-[14px] text-white/75 transition duration-300 hover:text-[#FF8A22]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[20px] font-medium text-white">
              Our Products
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              {products.map((product) => (
                <Link
                  key={product.href}
                  href={product.href}
                  className="w-fit text-[14px] leading-5 text-white/75 transition duration-300 hover:text-[#FF8A22]"
                >
                  {product.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-[20px] font-medium text-white">
              Contact Details
            </h3>

            <div className="mt-4 space-y-4 text-[14px] leading-6 text-white/75">

              {/* Address */}
              <a
                href="https://www.google.com/maps/place/Perroqueta+Materials+Science+I+Private+Limited+-+Avinashi/@11.1861683,77.2864394,19.63z/data=!4m6!3m5!1s0x3ba9030074cec3bf:0xacdd3bd52c27ff2b!8m2!3d11.1864612!4d77.2863818!16s%2Fg%2F11wy74llm7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition duration-300 hover:text-white"
              >
                <MapPin
                  size={20}
                  strokeWidth={1.8}
                  className="mt-1 shrink-0 text-white"
                />

                <span>
                  5/115, Lingapalayam,
                  <br />
                  Avinashi, Tamil Nadu,
                  <br />
                  641654
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:sales@perroqueta.com"
                className="flex items-center gap-3 transition duration-300 hover:text-white"
              >
                <Mail
                  size={20}
                  strokeWidth={1.8}
                  className="shrink-0 text-white"
                />

                <span>sales@perroqueta.com</span>
              </a>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone
                  size={20}
                  strokeWidth={1.8}
                  className="mt-1 shrink-0 text-white"
                />

                <div className="flex flex-col gap-1">
                  <a
                    href="tel:+919514077787"
                    className="transition duration-300 hover:text-white"
                  >
                    +91 95140 77787
                  </a>

                  <a
                    href="tel:+919514577787"
                    className="transition duration-300 hover:text-white"
                  >
                    +91 95145 77787
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Live Google Map */}
          <div>
            <div className="h-[200px] w-full overflow-hidden rounded-[18px] bg-white/10">
              <iframe
                title="Perroqueta Materials Science Private Limited - Avinashi"
                src="https://www.google.com/maps?q=11.1864612,77.2863818&z=18&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="text-[12px] text-white/70">
            © {currentYear} Perroqueta. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}