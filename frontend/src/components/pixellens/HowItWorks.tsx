import { Upload, MousePointer2, Clipboard } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    num: '01',
    title: 'Upload Image',
    description: 'Upload any JPEG, PNG or WEBP image and choose how many color clusters to extract.',
  },
  {
    icon: MousePointer2,
    num: '02',
    title: 'Hover to Pick',
    description: 'Move your cursor over any part of the image to instantly see its exact color code.',
  },
  {
    icon: Clipboard,
    num: '03',
    title: 'Copy & Use',
    description: 'Copy the HEX, RGB or HSL value with one click and use it anywhere.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-20 scroll-mt-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          How It <span className="text-gradient-primary">Works</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-md mx-auto">
          Three simple steps to extract any color.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-4">
              <div className="glass-panel p-6 text-center min-w-[220px] hover:border-primary/30 transition-colors">
                <span className="font-mono text-xs text-primary mb-3 block">{step.num}</span>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight size={24} className="text-muted-foreground hidden md:block flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
