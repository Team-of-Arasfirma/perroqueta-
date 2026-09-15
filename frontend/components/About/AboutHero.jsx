import Link from "next/link";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#121047]">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-[260px] w-[260px] rounded-full bg-[#6030C6]/25 blur-3xl" />

        <div className="absolute -right-16 top-0 h-[340px] w-[340px] rounded-full bg-[#FF8626]/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[500px] w-full max-w-[1600px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-12 xl:px-[62px]">
        {/* Left Content */}
        <div>
          <p className="mb-4 text-[14px] font-semibold uppercase tracking-[0.08em] text-[#D7C8FF] sm:text-[15px]">
            About Perroqueta
          </p>

          <h1 className="max-w-[720px] text-[34px] min-[375px]:text-[38px] min-[430px]:text-[42px] font-bold leading-[1.08] text-white sm:text-[52px] lg:text-[62px]">
            Materials Built for
            <span className="block text-[#FF9A48]">
              Better Spaces.
            </span>
          </h1>

          <p className="mt-5 max-w-[620px] text-[16px] leading-7 text-white/75">
            Perroqueta delivers roofing, architectural and building material
            solutions focused on quality, durability and modern performance.
          </p>

          {/* Breadcrumb */}
          <div className="mt-7 flex items-center gap-2 text-[14px] text-white/65">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <span className="text-white">
              About Us
            </span>
          </div>
        </div>

        {/* Abstract Animated Illustration */}
        <div className="relative flex min-w-0 min-h-[200px] sm:min-h-[320px] items-center justify-center lg:min-h-[420px]">
          <svg
            viewBox="0 0 600 420"
            className="h-auto w-full max-w-[590px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Large Soft Background Circle */}
            <circle
              cx="300"
              cy="210"
              r="155"
              fill="#FFFFFF"
              fillOpacity="0.025"
            />

            {/* Outer Purple Curve */}
            <path
              d="M65 270C145 120 235 95 310 185C385 275 465 280 545 125"
              stroke="#7550DE"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="12 12"
              opacity="0.85"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-48"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>

            {/* Orange Curve */}
            <path
              d="M60 310C155 205 225 180 300 235C385 300 455 260 550 180"
              stroke="#FF9147"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.9"
            >
              <animate
                attributeName="stroke-dasharray"
                values="1 20;20 8;1 20"
                dur="5s"
                repeatCount="indefinite"
              />
            </path>

            {/* Upper Light Curve */}
            <path
              d="M90 165C180 230 230 110 320 160C410 210 450 125 520 115"
              stroke="#D8CCFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 10"
              opacity="0.55"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="36"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>

            {/* Bottom Thin Curve */}
            <path
              d="M120 345C210 285 270 330 345 295C420 260 455 320 515 290"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="5 12"
              opacity="0.22"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-34"
                dur="5s"
                repeatCount="indefinite"
              />
            </path>

            {/* Floating Purple Dot */}
            <circle
              cx="150"
              cy="120"
              r="16"
              fill="#6030C6"
            >
              <animate
                attributeName="cy"
                values="120;102;120"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Floating Orange Dot */}
            <circle
              cx="470"
              cy="105"
              r="12"
              fill="#FF8A22"
            >
              <animate
                attributeName="cy"
                values="105;125;105"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Lavender Dot */}
            <circle
              cx="500"
              cy="285"
              r="8"
              fill="#D8CCFF"
              opacity="0.9"
            >
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Small Orange Dot */}
            <circle
              cx="120"
              cy="300"
              r="7"
              fill="#FF9147"
            >
              <animate
                attributeName="r"
                values="7;10;7"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Small Purple Dot */}
            <circle
              cx="390"
              cy="90"
              r="6"
              fill="#8C68E8"
              opacity="0.9"
            >
              <animate
                attributeName="cy"
                values="90;78;90"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Center Glow */}
            <circle
              cx="300"
              cy="210"
              r="55"
              fill="#6030C6"
              fillOpacity="0.08"
            >
              <animate
                attributeName="r"
                values="50;70;50"
                dur="4s"
                repeatCount="indefinite"
              />

              <animate
                attributeName="fill-opacity"
                values="0.05;0.14;0.05"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Center Small Ring */}
            <circle
              cx="300"
              cy="210"
              r="28"
              stroke="#D8CCFF"
              strokeWidth="2"
              strokeOpacity="0.28"
            >
              <animate
                attributeName="r"
                values="26;36;26"
                dur="4s"
                repeatCount="indefinite"
              />

              <animate
                attributeName="stroke-opacity"
                values="0.2;0.5;0.2"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>
    </section>
  );
}