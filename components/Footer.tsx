import Link from "./Link";
import { SOCIAL_LINKS } from "../config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-500 py-9 px-6">
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
    </footer>
  );
} 