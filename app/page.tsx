import Hero from "@/components/Hero";
import TrustStrip from "@/components/marketing/TrustStrip";
import TrainingGoals from "@/components/marketing/TrainingGoals";
import Programs from "@/components/Programs";
import SchedulePreview from "@/components/marketing/SchedulePreview";
import MembershipCTA from "@/components/MembershipCTA";
import PersonalTrainingSection from "@/components/marketing/PersonalTrainingSection";
import TrainersSection from "@/components/marketing/TrainersSection";
import TransformationsSection from "@/components/marketing/TransformationsSection";
import FacilitiesSection from "@/components/marketing/FacilitiesSection";
import KitchenTeaser from "@/components/KitchenTeaser";
import AppPlatformSection from "@/components/marketing/AppPlatformSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import FinalCTA from "@/components/marketing/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <TrainingGoals />
      <Programs />
      <SchedulePreview />
      <MembershipCTA />
      <PersonalTrainingSection />
      <TrainersSection limit={4} />
      <TransformationsSection />
      <FacilitiesSection />
      <KitchenTeaser />
      <AppPlatformSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}
