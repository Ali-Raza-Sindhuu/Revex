import PageHeader from "@/components/shared/PageHeader";
import { Reveal } from "@/shared/motion";

const sections = [
  {
    title: "What we collect",
    body: "Account details you provide (name, email, password), vehicle preferences you select during sign-up, and basic usage data such as pages visited and saved listings.",
  },
  {
    title: "How we use it",
    body: "To run your account, show you relevant listings, respond to enquiries you submit, and keep the garage and checkout flows working across sessions.",
  },
  {
    title: "What we don't do",
    body: "We don't sell personal data to third parties, and this demo build doesn't send marketing email or share data with advertising networks.",
  },
  {
    title: "Cookies and storage",
    body: "We store your session token and a small amount of preference data in your browser so you stay logged in and your guest garage survives a refresh.",
  },
  {
    title: "Your choices",
    body: "You can edit or delete your account details from your profile, and you can contact us with any request about the data we hold on you.",
  },
];

const PrivacyPolicyPage = () => (
  <>
    <PageHeader
      title="Privacy Policy"
      breadcrumb="Privacy Policy"
      eyebrow="How we handle your data"
      description="A plain-language summary of what REVEX collects and why. This is placeholder copy for the demo build — replace it with policy reviewed by counsel before taking the site live."
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

export default PrivacyPolicyPage;