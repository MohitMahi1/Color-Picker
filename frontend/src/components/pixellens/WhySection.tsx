import { Palette, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'AI Color Clustering',
    description: 'KMeans groups visually similar colors, giving you meaningful palette extraction — not just random pixels.',
  },
  {
    icon: Zap,
    title: 'Real-Time Detection',
    description: 'Hover any pixel and instantly get HEX, RGB, and HSL — no clicks needed.',
  },
  {
    icon: Shield,
    title: 'Your Images Stay Private',
    description: 'Processing happens on your local machine. Nothing is uploaded to any cloud.',
  },
];

const WhySection = () => {
  return (
    <section id="why" className="py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Why Choose <span className="text-gradient-primary">PixelLens</span>?
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-md mx-auto">
          Built for designers, developers, and anyone who works with color.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="glass-panel p-6 hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
