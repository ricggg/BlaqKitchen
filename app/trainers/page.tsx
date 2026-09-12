import PageHeader from "@/components/marketing/PageHeader";
import TrainersSection from "@/components/marketing/TrainersSection";
import FinalCTA from "@/components/marketing/FinalCTA";

export default function TrainersPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <PageHeader
        eyebrow="Coaches"
        title="Certified coaches, every session"
        description="No unsupervised floors. Every class and every rep is watched by a coach who knows your name and your numbers."
      />
      <TrainersSection showAllLink={false} />
      <FinalCTA />
    </div>
  );
}
