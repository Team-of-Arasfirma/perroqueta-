import {
  Target,
  Eye,
} from "lucide-react";

export default function MissionVision() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[30px] font-bold text-[#5C35C6] sm:text-[34px]">
            Mission &amp; Vision
          </h2>
        </div>

        {/* Cards */}
        <div className="mx-auto mt-9 grid max-w-[1160px] gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Mission */}
          <div className="flex items-center gap-5 rounded-[16px] bg-[#F3EEFF] px-5 py-6 sm:gap-6 sm:px-6">
            <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[14px]">
              <Target
                size={42}
                strokeWidth={1.7}
                className="text-[#5C35C6]"
              />
            </div>

            <div>
              <h3 className="text-[18px] font-bold text-[#5C35C6]">
                Our Mission
              </h3>

              <p className="mt-3 max-w-[430px] text-[14px] leading-6 text-[#333333]">
                To deliver high-quality roofing and building solutions through
                innovation, advanced technology, and a customer-first approach.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="flex items-center gap-5 rounded-[16px] bg-[#FFF0EA] px-5 py-6 sm:gap-6 sm:px-6">
            <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[14px] ">
              <Eye
                size={42}
                strokeWidth={1.7}
                className="text-[#FF792D]"
              />
            </div>

            <div>
              <h3 className="text-[18px] font-bold text-[#FF792D]">
                Our Vision
              </h3>

              <p className="mt-3 max-w-[430px] text-[14px] leading-6 text-[#333333]">
                To be India&apos;s most trusted and innovative provider of
                roofing solutions, setting new standards in quality and
                sustainability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}