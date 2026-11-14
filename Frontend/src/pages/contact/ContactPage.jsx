import PageHeader from "@/components/shared/PageHeader";
import CtaBanner from "@/components/shared/CtaBanner";
import heroImage from "@/assets/contact_hero.png";
import ContactSection from "@/features/contact/components/ContactSection";
import DealershipsSection from "@/features/contact/components/DealershipsSection";
import ContactFaqSection from "@/features/contact/components/ContactFaqSection";

const ContactPage = () => (
  <>
    <PageHeader title="Contact us" breadcrumb="Contact" eyebrow="The conversation starts here" description="A question about a car, a plan for your next drive, or a little advice. Let’s find your next step together." heroImage={heroImage} />
    <ContactSection />
    <DealershipsSection />
    <ContactFaqSection />
    <CtaBanner heading="Something catch your eye?" text="Explore the collection, build your shortlist and find the car you’d like to see up close." buttonLabel="Browse inventory" href="/inventory" />
  </>
);
export default ContactPage;
