import { Leaf, Droplets, Recycle, Gift } from "lucide-react";

type Stat = { label: string; value: string; sub?: string; icon: React.ElementType };

const stats: Stat[] = [
  { label: "CO₂ avoided", value: "1.2t", sub: "lifetime", icon: Leaf },
  { label: "Water saved", value: "18k L", icon: Droplets },
  { label: "Landfill reduced", value: "4.3 m³", icon: Recycle },
  { label: "Items donated", value: "27", icon: Gift },
];

const ImpactStats = () => {
  return (
    <section className="py-14 bg-[#F7FDF8]">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-xl border border-primary/20 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <div className="text-sm font-medium text-[#1B1B1B]">
                    {s.label}
                  </div>
                </div>
                <div className="mt-3 text-3xl font-bold text-primary">
                  {s.value}
                </div>
                {s.sub && (
                  <div className="text-xs text-[#6B7280] mt-1">{s.sub}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;

