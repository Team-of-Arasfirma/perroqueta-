const specifications = [
  {
    label: "Product",
    value: "Ceramic Roofing Tiles",
  },
  {
    label: "Thickness",
    value: "10 mm (or) 0.39 mm",
  },
  {
    label: "Weight",
    value: "2.3 kg",
  },
  {
    label: "Width",
    value: "1 ft",
  },
  {
    label: "Length",
    value: "1.25 ft",
  },
  {
    label: "Available Colours",
    value: "Multiple colour options available",
  },
];

export default function CeramicSpecifications() {
  return (
    <section className="w-full bg-[#F7F4FC] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
              Technical Details
            </p>

            <h2 className="mt-3 text-[30px] font-bold leading-tight text-[#171717] sm:text-[36px]">
              Ceramic Roofing Tile Specifications
            </h2>

            <p className="mt-4 max-w-[520px] text-[14px] leading-7 text-[#666666]">
              Standard dimensions and technical information for Perroqueta
              Ceramic Roofing Tiles.
            </p>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-[#E4DDEF] bg-white shadow-sm">
            {specifications.map((item, index) => (
              <div
                key={item.label}
                className={`grid gap-2 px-5 py-4 sm:grid-cols-[190px_1fr] sm:px-6 ${
                  index !== specifications.length - 1
                    ? "border-b border-[#EEEEEE]"
                    : ""
                }`}
              >
                <p className="text-[13px] font-semibold text-[#333333]">
                  {item.label}
                </p>

                <p className="text-[14px] leading-6 text-[#666666]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}