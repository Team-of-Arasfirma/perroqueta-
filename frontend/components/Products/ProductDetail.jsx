import ClayHero from "./Clay/ClayHero";
import PUFHero from "./PUF/PUFHero";
import StoneCoatedDetails from "./Stone/StoneCoatedDetails";
import WPCHero from "./WPC/WPCHero";

const defaultHeroes = {
  none: ClayHero,
  options: PUFHero,
  profileColors: StoneCoatedDetails,
  wpcFinishes: WPCHero,
};

export default function ProductDetail({ product, sections, originalSelector }) {
  const selector = product.hero.selectorType;
  const hero = selector === originalSelector ? sections.hero : defaultHeroes[selector];

  return (
    <main className="bg-white">
      {product.sectionOrder.map((section) => {
        const Section = section === "hero" ? hero : sections[section];
        return <Section key={section} product={product} />;
      })}
    </main>
  );
}
