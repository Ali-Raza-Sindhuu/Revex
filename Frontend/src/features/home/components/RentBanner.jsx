import { Link } from "react-router-dom";
import { ArrowRight, KeyRound } from "lucide-react";
import image from "@/assets/rent_car.png";
import { Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";
import { btn } from "@/shared/styles";

const RentBanner = ({ ctaHref = "/inventory?listingType=rent" }) => (
  <section
    aria-labelledby="rent-title"
    className="bg-white px-4 pb-16 md:px-12 md:pb-24"
  >
    <Reveal
      y={32}
      className="relative mx-auto flex max-w-[1400px] flex-col overflow-hidden rounded-3xl bg-[#f05a1a] md:min-h-[360px]"
    >
      <div className="relative z-10 max-w-md p-6 md:p-12">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85"><KeyRound aria-hidden="true" className="size-4" />Rental cars</div>

        <SectionHeading
          id="rent-title"
          tone="dark"
          lead={["Make room for", "the road ahead."]}
          body="Browse available rentals, choose dates that suit your plans, and reserve your vehicle online."
          bodyClassName="text-white/90"
          className="mt-4"
        />

        <Link to={ctaHref} className={`group mt-8 ${btn.light}`}>
          Browse rentals
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Stacked under the text on mobile, full-width background from md up */}
      <img
        src={image}
        loading="lazy"
        alt="Off-road SUV with a roof rack"
        className="h-56 w-full object-cover object-right sm:h-72 md:absolute md:inset-0 md:h-full"
      />
    </Reveal>
  </section>
);

export default RentBanner;
