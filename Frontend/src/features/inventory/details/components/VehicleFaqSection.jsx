import SectionHeading from "@/shared/SectionHeading";
import FaqAccordion from "@/components/shared/FaqAccordion";

const VehicleFaqSection = ({ car }) => {
  const rental = car.listingType === "rent";
  const questions = [
    { question: "Can I see the car before making a decision?", answer: "Use the enquiry form to request a viewing and share your preferred time. Ask the dealer to confirm the exact vehicle, its availability and any documents needed for a test drive before you travel." },
    { question: "How do I check the vehicle's history and condition?", answer: "Request the service records, ownership history, vehicle identification number and any available inspection report. The specifications and VIN on this demonstration listing are sample values; verify the documents for the actual vehicle." },
    { question: rental ? "What does the rental estimate include?" : "Is the monthly estimate a finance offer?", answer: rental ? "The calculator multiplies the daily sample price by the number of days, with a one-day minimum. It does not confirm availability or include deposits, insurance, mileage allowances, taxes or other fees. Request a full written quote and rental terms." : "No. It divides the sample price minus your deposit by the selected number of months. Interest, taxes and fees are excluded. Ask for a full written quote and review the total payable before agreeing to any finance arrangement." },
    { question: "What happens after I enquire or request a test drive?", answer: "Your message or preferred test-drive date is saved with this vehicle in the database. A test-drive request is not a confirmed appointment, and an enquiry does not reserve the vehicle. Rental dates are held only after payment is confirmed." },
  ];
  return (
    <section aria-labelledby="vehicle-faq-title" className="bg-white px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading id="vehicle-faq-title" eyebrow="Before the next mile" lead={["Good questions."]} muted={["Clear next steps."]} body="A little clarity before you get behind the wheel." />
        <FaqAccordion items={questions} />
      </div>
    </section>
  );
};
export default VehicleFaqSection;

