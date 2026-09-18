import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="w-full bg-[#FBFBFB] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)]">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}