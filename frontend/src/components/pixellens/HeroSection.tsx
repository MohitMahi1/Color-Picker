import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 mb-8 animate-fade-in-up">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs font-mono text-muted-foreground">Powered by KMeans AI</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Extract Any Color From Any Image —{' '}
          <span className="text-gradient-primary">Instantly.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Upload your image, hover any pixel, and get the exact HEX, RGB & HSL color code — powered by KMeans AI clustering.
        </p>

        <a
          href="#tool"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:brightness-110 transition-all glow-amber animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          Try It Now
          <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
