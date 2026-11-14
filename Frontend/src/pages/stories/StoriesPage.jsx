import { ArrowRight, Compass, Gauge, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import CtaBanner from "@/components/shared/CtaBanner";
import { Reveal } from "@/shared/motion";

const stories = [
  { icon: Compass, category: "Finding the right fit", title: "A more considered way to choose", body: "Start with the details that matter to you, compare vehicles clearly, and take the next step when you feel ready.", href: "/inventory", link: "Explore the inventory" },
  { icon: Gauge, category: "On the road", title: "Make room for the weekend", body: "Choose a vehicle for the drive ahead, check the rental dates, and keep the plan in one place while you decide.", href: "/inventory", link: "Browse rental cars" },
  { icon: ShieldCheck, category: "Peace of mind", title: "Know what you are looking at", body: "Vehicle details, specifications, and enquiry options stay close together, so it is easier to ask the right questions.", href: "/services", link: "See our services" },
];

const StoriesPage = () => (
  <>
    <PageHeader title="Stories from the road" breadcrumb="Stories" eyebrow="The REVEX journal" description="Ideas and practical guidance for choosing a vehicle, planning a drive, and enjoying every mile." />
    <section className="bg-white px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f05a1a]">Explore</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-neutral-950 md:text-5xl">Good journeys begin with good decisions.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stories.map(({ icon: Icon, category, title, body, href, link }, index) => (
            <Reveal key={title} y={20} delay={index * 0.08}>
              <article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-6 md:p-8">
                <span className="grid size-11 place-items-center rounded-xl bg-white text-[#f05a1a] shadow-sm"><Icon className="size-5" /></span>
                <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">{category}</p>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-neutral-950">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">{body}</p>
                <Link to={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-[#f05a1a]">{link}<ArrowRight className="size-4" /></Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    <CtaBanner heading="Your next story starts here." text="Find a vehicle that fits the way you want to travel." buttonLabel="Browse inventory" href="/inventory" />
  </>
);

export default StoriesPage;
