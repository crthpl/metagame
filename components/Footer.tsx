import Link from "./Link";
import { SOCIAL_LINKS } from "@/utils/urls";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-9 px-6 flex flex-col gap-4">
      <div className="flex justify-between gap-2">
        <div className="container mx-auto flex gap-4 flex-col-reverse md:flex-row items-center justify-between">
          <p className="text-cyan-300">© {year} Metagame. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link
                href={SOCIAL_LINKS.TWITTER}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </Link>
              <Link
                href={SOCIAL_LINKS.DISCORD}
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </Link>
            </div>
          </div>
      </div>
      <div className="text-center md:text-righ font-light text-sm">Website design taken from <Link href="https://wts.sh" target="_blank" rel="noopener noreferrer">WhatTheStack</Link>, by courteous permission of <Link href="https://darko.io" target="_blank" rel="noopener noreferrer">Darko</Link></div>
    </footer>
  );
} 