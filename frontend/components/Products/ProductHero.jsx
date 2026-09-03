export default function ProductHero() {
  return (
    <section className="w-full bg-[#F7F4FC] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="max-w-[760px]">
          <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
            Our Products
          </p>

          <h1 className="mt-4 text-[34px] font-bold uppercase leading-[1.08] text-[#171717] sm:text-[40px] lg:text-[46px]">
            Materials Built for
            <span className="block">Performance.</span>
          </h1>

          <p className="mt-5 max-w-[650px] text-[15px] leading-7 text-[#555555]">
            Explore roofing, wall, clay and structural solutions designed for
            durability, performance and modern building requirements.
          </p>
        </div>
      </div>
    </section>
  );
}