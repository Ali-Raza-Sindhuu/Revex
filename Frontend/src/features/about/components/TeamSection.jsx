import { useState } from "react";
import SectionHeading from "@/shared/SectionHeading";
import { Reveal } from "@/shared/motion";
import ameliaPortrait from "@/assets/first.jpg";
import danielPortrait from "@/assets/Professional Portrait in a Modern Campus.png";
import priyaPortrait from "@/assets/Confident Campus Portrait of Priya Nair.png";
import lucasPortrait from "@/assets/Confident Outdoor Portrait of Lucas Brandt.png";

const team = [
  ["AH", "Amelia Hart", "Founder & CEO", ameliaPortrait],
  ["DO", "Daniel Okoye", "Head of Sales", danielPortrait],
  ["PN", "Priya Nair", "Customer Experience Lead", priyaPortrait],
  ["LB", "Lucas Brandt", "Chief Inspector", lucasPortrait],
];

const TeamCard = ({ initials, name, role, image }) => {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {!imageFailed && <img src={image} alt={`${name}, ${role}`} loading="lazy" onError={() => setImageFailed(true)} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
        {imageFailed && <div aria-hidden="true" className="grid size-full place-items-center bg-neutral-900 text-5xl font-bold tracking-tighter text-[#f05a1a]">{initials}</div>}
      </div>
      <div className="px-5 py-5"><h3 className="text-base font-bold tracking-tight text-neutral-950">{name}</h3><p className="mt-1 text-xs text-neutral-500">{role}</p></div>
    </article>
  );
};

const TeamSection = () => (
  <section aria-labelledby="team-title" className="bg-white px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading id="team-title" eyebrow="People behind the keys" lead={["Car people."]} muted={["People people."]} body="Meet the roles behind a more considered journey, from the first conversation to life on the road." />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map(([initials, name, role, image], index) => <Reveal key={name} y={24} delay={index * 0.08}><TeamCard initials={initials} name={name} role={role} image={image} /></Reveal>)}
      </div>
    </div>
  </section>
);

export default TeamSection;
