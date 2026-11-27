import { getProductIcon } from "../productIcons";

export function StoneCoatedCards({ items }) {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = getProductIcon(item.iconKey);

        return (
          <article
            key={item.title}
            className="group rounded-[15px] border border-[#EAEAEA] bg-[#FBFBFB] p-6 motion-safe:transition motion-safe:duration-300 lg:hover:border-[#D5C6F1] lg:hover:bg-white lg:hover:shadow-lg motion-safe:lg:hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#F0EAFB] text-[#6030C6] motion-safe:transition motion-safe:duration-300 lg:group-hover:bg-[#6030C6] lg:group-hover:text-white">
              <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
            </div>

            <h3 className="mt-5 text-[18px] font-semibold text-[#171717]">
              {item.title}
            </h3>

            <p className="mt-3 text-base leading-7 text-[#666666]">
              {item.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export default function StoneCoatedApplications({ product }) {
  const { applications } = product;

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="max-w-[760px]">
          <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
            {applications.eyebrow}
          </p>

          <h2 className="mt-3 text-[30px] font-bold leading-tight text-[#171717] sm:text-[36px]">
            {applications.heading}
          </h2>

          <p className="mt-4 max-w-[680px] text-[15px] leading-7 text-[#666666]">
            {applications.description}
          </p>
        </div>

        <StoneCoatedCards items={applications.items} />
      </div>
    </section>
  );
}
