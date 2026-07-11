import HeroSection from "@/components/sections/HeroSection";
import ImpactStats from "@/components/sections/ImpactStats";
import RoleGrid from "@/components/sections/RoleGrid";
import Seo from "@/components/Seo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Nyuzi — Circular Fashion & Upcycling"
        description="Donate, upcycle, and shop reclaimed fashion. Track CO₂, water, and landfill savings."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Nyuzi',
        }}
      />

      <main>
        <HeroSection />
        <ImpactStats />
        <RoleGrid />
      </main>

    </div>
  );
};

export default Index;
