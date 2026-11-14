import PageHeader from "@/components/shared/PageHeader";
import { Reveal } from "@/shared/motion";

const sections = [
  {
    title: "Using this site",
    body: "REVEX is a demo car marketplace. Listings, prices, dealership addresses and contact details shown across the site are placeholders for demonstration purposes only.",
  },
  {
    title: "Accounts",
    body: "You're responsible for keeping your login details secure. Don't share your account, and let us know if you think someone else has access to it.",
  },
  {
    title: "Enquiries and the contact form",
    body: "Forms on this site validate locally for demo purposes. No enquiry submitted here is actually sent, stored, or responded to unless stated otherwise.",
  },
  {
    title: "No warranty",
    body: "This demo is provided as-is, without warranty of any kind, express or implied, including around availability, accuracy of listings, or fitness for a particular purpose.",
  },
  {
    title: "Changes",
    body: "These terms may change as the project evolves. Continued use of the site after a change means you accept the updated terms.",
  },
];

const TermsPage = () => (
  <>
    <PageHeader
      title="Terms & Conditions"
      breadcrumb="Terms & Conditions"
      eyebrow="The rules of the road"
      description="A plain-language summary of how this demo site works. This is placeholder copy — replace it with terms reviewed by counsel before taking the site live."
    />
    <section className="bg-white px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
            Demo content: this page is a structural placeholder to keep the sign-up and footer links working. It is not legal advice and should not be published as-is.
          </p>
        </Reveal>
        <div className="mt-10 flex flex-col gap-10">
          {sections.map(({ title, body }, index) => (
            <Reveal key={title} y={20} delay={index * 0.06}>
              <h2 className="text-xl font-bold tracking-tight text-neutral-950">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default TermsPage;