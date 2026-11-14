import PageHeader from "@/components/shared/PageHeader";
import CtaBanner from "@/components/shared/CtaBanner";
import heroImage from "@/assets/services_hero.png";
import ServicesGrid from "@/features/services/components/ServicesGrid";
import InspectionSection from "@/features/services/components/InspectionSection";
import HowItWorksSection from "@/features/services/components/HowItWorksSection";
import ServicesFaqSection from "@/features/services/components/ServicesFaqSection";

const ServicesPage = () => (
  <>
    <PageHeader title="Our services" breadcrumb="Services" eyebrow="Support for every mile" description="Find your next car, plan a change or take care of the one you love. Start with a conversation." heroImage={heroImage} />
    <ServicesGrid />
    <InspectionSection />
    <HowItWorksSection />
    <ServicesFaqSection />
    <CtaBanner heading="What’s your next move?" text="Tell us where you want to go. We’ll help you explore the cars, services and next steps that fit." buttonLabel="Talk to our team" href="/contact" />
  </>
);

export default ServicesPage;
