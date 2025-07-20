
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold">
              Finance Flow
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} All rights reserved.
            Your trusted partner in financial planning.
          </p>
        </div>
        <div className="flex gap-4 md:gap-6">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
