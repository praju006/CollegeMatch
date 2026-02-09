import { GraduationCap, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">CollegeMatch</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              AI-powered college recommendation platform helping students find their 
              perfect educational match in Bangalore. Make informed decisions with 
              data-driven insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/colleges" className="transition-colors hover:text-foreground">
                  Browse Colleges
                </Link>
              </li>
              <li>
                <Link to="/recommend" className="transition-colors hover:text-foreground">
                  Get Recommendations
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="transition-colors hover:text-foreground">
                  Compare Colleges
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="cursor-default">How It Works</span>
              </li>
              <li>
                <span className="cursor-default">Placement Statistics</span>
              </li>
              <li>
                <span className="cursor-default">FAQs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 CollegeMatch. Built for educational purposes.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
