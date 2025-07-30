import React from 'react';
import { Card } from './Card';
import { cn } from '@/utils/cn';

interface SpeakerCardProps {
  name: string;
  image?: string;
  gameName: string;
  gameUrl: string;
  gameName2?: string;
  gameUrl2?: string;
  slug?: string;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({
  name,
  image,
  gameName,
  gameUrl,
  gameName2,
  gameUrl2,
}) => {
  const ExternalLinkIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 hidden md:inline"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );

  return (
    <Card className="w-24 sm:w-32 md:w-48 flex flex-col items-center py-1 sm:pt-2 bg-slate-700 bg-opacity-50" padless>
      <img
        alt={name || "YOU?"}
        className={cn(
          "paper glitch mb-2 rounded aspect-square w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40",
          image ? "object-cover" : "object-fill"
        )}
        src={image ? `/images/${image.split('/').pop()}` : "/images/incognito.svg"}
        height="160"
        width="160"
      />
      <div className="flex-grow mx-1">
        <h3
          className={cn(
            "font-bold text-xs",
            name.length > 20 ? "md:text-sm" : "md:text-base"
          )}
        >
          {name}
        </h3>
        <a
          href={gameName === "METAGAME" ? `/?metagame=true#speakers` : gameUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary-200 text-[10px] sm:text-sm font-semibold hover:text-secondary-300 flex items-center justify-center gap-1 mt-1"
        >
          {gameName}
          <ExternalLinkIcon />
        </a>
        {gameName2 && gameUrl2 && (
          <a
            href={gameName2 === "METAGAME" ? `/?metagame=true#speakers` : gameUrl2}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-200 text-[10px] sm:text-sm font-semibold hover:text-secondary-300 flex items-center justify-center gap-1"
          >
            {gameName2}
            <ExternalLinkIcon />
          </a>
        )}
      </div>
    </Card>
  );
}; 