import { StoneCoatedCards } from "./StoneCoatedApplications";

export function StoneCoatedTextSection({ content, shaded = false }) {
  return (
    <section className={`w-full py-16 sm:py-20 ${shaded ? "bg-[#FBFBFB]" : "bg-white"}`}>
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="max-w-[760px]">
          <h2 className="text-[30px] font-bold leading-tight text-[#171717] sm:text-[36px]">
            {content.heading}
          </h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-[#5F5F5F]">
            {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StoneCoatedCardSection({ content }) {
  return (
    <section className="w-full bg-[#FBFBFB] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <h2 className="max-w-[760px] text-[30px] font-bold leading-tight text-[#171717] sm:text-[36px]">
          {content.heading}
        </h2>
        <StoneCoatedCards items={content.items} />
      </div>
    </section>
  );
}
