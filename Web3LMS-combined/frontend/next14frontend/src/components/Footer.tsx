"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

function BaseFooter() {
  return (
    <footer className="bg-primary text-primary-foreground shadow-sm border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              WEB3LMS
            </h2>
            <p className="text-primary-foreground/80 mb-6">
              Empowering the next generation of blockchain developers through
              decentralized learning and verifiable credentials.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.linkedin.com/in/vinit-inamke/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-secondary transition-all transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </Link>
              <Link
                href="https://github.com/VINIT-INAMKE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-secondary transition-all transform hover:scale-110"
                aria-label="Github"
              >
                <Github size={24} />
              </Link>
            </div>
          </div>

          {/* Learn Links */}
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">Learn</h3>
            <ul className="space-y-2">
              {[
                "Blockchain Basics",
                "Smart Contracts",
                "DeFi Development",
                "NFT Creation",
                "Web3 Security",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-primary-foreground/70 hover:text-secondary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">Community</h3>
            <ul className="space-y-2">
              {[
                "Developer DAO",
                "Become an Instructor",
                "Student Projects",
                "Governance",
                "Documentation",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-primary-foreground/70 hover:text-secondary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                "Whitepaper",
                "Token Economics",
                "Smart Contracts",
                "API Documentation",
                "Help Center",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-primary-foreground/70 hover:text-secondary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-primary-foreground/80 mb-2">
                Contact:{" "}
                <Link
                  href="mailto:vinitinamkekse@gmail.com"
                  className="text-secondary hover:text-secondary/80"
                >
                  vinitinamkekse@gmail.com
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
              <span className="text-primary-foreground/60">
                © {new Date().getFullYear()} WEB3LMS DAO
              </span>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Smart Contract Terms",
                ].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="text-primary-foreground/60 hover:text-secondary transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-primary-foreground/60">Verified Contract:</span>
              <Link
                href="#"
                className="text-secondary hover:text-secondary/80 font-mono text-sm"
              >
                0x1234...5678
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default BaseFooter;
