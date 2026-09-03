import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  ArrowRight,
} from "lucide-react";

import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const contactItems = [
  {
    icon: MapPin,
    title: "Head Office",
    lines: [
      "5/115, Lingapalayam,",
      "Avinashi, Tamil Nadu",
      "641654, India",
    ],
    href: "https://www.google.com/maps?q=11.1864612,77.2863818",
    tone: "purple",
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+91 74492 77787"],
    href: "tel:+917449277787",
    tone: "orange",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["sales@perroqueta.com"],
    href: "mailto:sales@perroqueta.com",
    tone: "purple",
  },
  {
    icon: Clock3,
    title: "Working Hours",
    lines: [
      "Mon - Sat: 9:00 AM - 6:00 PM",
      "Sunday: Closed",
    ],
    href: null,
    tone: "orange",
  },
];

export default function ContactInfo() {
  return (
    <div className="rounded-[18px] bg-[#FBFAFD] p-6 sm:p-7">
      {/* Heading */}
      <div>
        <h2 className="max-w-[280px] text-[28px] font-bold leading-[1.15] text-[#17152F] sm:text-[32px]">
          Let&apos;s Connect
          <span className="block">With Perroqueta</span>
        </h2>

        <div className="mt-4 h-[2px] w-[36px] bg-[#FF8626]" />
      </div>

      {/* Timeline + Contact Cards */}
      <div className="relative mt-7">
        {/* Vertical line */}
        <div className="absolute bottom-6 left-[10px] top-6 w-px bg-[#DDD8E8]" />

        <div className="space-y-3">
          {contactItems.map((item, index) => {
            const Icon = item.icon;

            const iconBg =
              item.tone === "orange"
                ? "bg-[#FF8626]"
                : "bg-[#6030C6]";

            const dotBg =
              item.tone === "orange"
                ? "bg-[#FF8626]"
                : "bg-[#6030C6]";

            const Content = (
              <div className="group relative ml-7 flex min-h-[94px] items-center gap-4 rounded-[13px] bg-white px-4 py-4 shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                {/* Icon */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${iconBg}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-[14px] font-semibold text-[#1B1B1B]">
                    {item.title}
                  </h3>

                  <div className="mt-1">
                    {item.lines.map((line) => (
                      <p
                        key={line}
                        className="text-[12px] leading-[1.55] text-[#555555]"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                {item.href && (
                  <ArrowRight className="h-5 w-5 shrink-0 text-[#FF8626] transition duration-300 group-hover:translate-x-1" />
                )}
              </div>
            );

            return (
              <div key={item.title} className="relative">
                {/* Timeline Dot */}
                <div
                  className={`absolute left-[6px] top-1/2 z-10 h-[9px] w-[9px] -translate-y-1/2 rounded-full border-2 border-[#FBFAFD] ${dotBg}`}
                />

                {item.href ? (
                  <a
                    href={item.href}
                    target={
                      item.title === "Head Office"
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      item.title === "Head Office"
                        ? "noreferrer"
                        : undefined
                    }
                  >
                    {Content}
                  </a>
                ) : (
                  Content
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Social */}
      <div className="mt-7">
        <p className="text-[14px] font-semibold text-[#24203D]">
          Follow Us
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href="https://wa.me/917449277787"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:-translate-y-1"
          >
            <FaWhatsapp className="h-4 w-4" />
          </a>

          <a
            href="#"
            aria-label="Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white transition hover:-translate-y-1"
          >
            <FaFacebookF className="h-4 w-4" />
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4405F] text-white transition hover:-translate-y-1"
          >
            <FaInstagram className="h-4 w-4" />
          </a>

          <a
            href="#"
            aria-label="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2] text-white transition hover:-translate-y-1"
          >
            <FaLinkedinIn className="h-4 w-4" />
          </a>

          <a
            href="#"
            aria-label="YouTube"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF0000] text-white transition hover:-translate-y-1"
          >
            <FaYoutube className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}