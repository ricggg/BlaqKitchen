import PageHeader from "@/components/marketing/PageHeader";
import TransformationsSection from "@/components/marketing/TransformationsSection";
import FinalCTA from "@/components/marketing/FinalCTA";

export default function TransformationsPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <PageHeader
        eyebrow="Real results"
        title="Transformation stories"
        description="Real members, real progress — strength gained, weight lost, and habits that stuck."
      />
      <TransformationsSection showAllLink={false} />
      <FinalCTA />
    </div>
  );
}
