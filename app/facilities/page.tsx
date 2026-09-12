import PageHeader from "@/components/marketing/PageHeader";
import FacilitiesSection from "@/components/marketing/FacilitiesSection";
import FinalCTA from "@/components/marketing/FinalCTA";

export default function FacilitiesPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <PageHeader
        eyebrow="The club"
        title="Built for serious training"
        description="A full strength floor, functional zone, boxing ring, recovery lounge, in-house kitchen and locker rooms — all under one roof."
      />
      <FacilitiesSection showAllLink={false} />
      <FinalCTA />
    </div>
  );
}
