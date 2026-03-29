const navLinks = [
  { label: 'Tool', href: '#tool' },
  { label: 'Why PixelLens', href: '#why' },
  { label: 'How It Works', href: '#how' },
];

const Footer = () => {
  return (
    <footer className="border-t border-border pt-8 pb-12">
      {/* Privacy banner */}
      <div className="container mx-auto px-4 mb-8">
        <div className="glass-panel p-4 text-center flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>🔒</span>
          <span>We think data protection is important! No data is sent. The magic happens in your browser.</span>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">PL</span>
            </div>
            <span className="text-sm text-muted-foreground">Pixel-perfect colors, powered by AI.</span>
          </div>

          {/* Center */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <span className="text-xs text-dim">Built with FastAPI + React</span>
        </div>

        <div className="text-center mt-8 text-xs text-dim">
          © 2025 PixelLens. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
