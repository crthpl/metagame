import React from 'react';
import { Card } from './Card';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { DbProfile } from '@/types/database/dbTypeAliases';



type SpeakerCardProps = {
  profile: Partial<DbProfile>;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({profile}) => {
  const { first_name, last_name, profile_pictures_url, site_name, site_url, site_name_2, site_url_2 } = profile;
  
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

  // Handle different image URL formats
  const getImageSrc = (imageUrl: string | null) => {
    if (!imageUrl) return "/images/incognito.svg";
    
    // If it's already a full URL (from Supabase), use it directly
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's a relative path, treat it as before (fallback for markdown data)
    return `/images/${imageUrl.split('/').pop()}`;
  };

  return (
    <Card className="w-24 sm:w-32 md:w-48 flex flex-col items-center py-1 sm:pt-2 bg-slate-700 bg-opacity-50" padless>
      <Image
        alt={first_name + ' ' + last_name || "YOU?"}
        className={cn(
          "glitch mb-2 rounded aspect-square w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40",
          profile_pictures_url ? "object-cover" : "object-fill"
        )}
        src={getImageSrc(profile_pictures_url ?? null)}
        height="160"
        width="160"
      />
      <div className="flex-grow mx-1">
        <h3
          className={cn(
            "font-bold text-xs",
            (first_name + ' ' + last_name).length > 20 ? "md:text-sm" : "md:text-base"
          )}
        >
          {first_name + ' ' + last_name}
        </h3>
        <a
          href={site_name === "METAGAME" ? `/?metagame=true#speakers` : site_url ?? ""  }
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary-200 text-[10px] sm:text-sm font-semibold hover:text-secondary-300 flex items-center justify-center gap-1 mt-1"
        >
          {site_name}
          <ExternalLinkIcon />
        </a>
        {site_name_2 && site_url_2 && (
          <a
            href={site_name_2 === "METAGAME" ? `/?metagame=true#speakers` : site_url_2}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-200 text-[10px] sm:text-sm font-semibold hover:text-secondary-300 flex items-center justify-center gap-1"
          >
            {site_name_2}
            <ExternalLinkIcon />
          </a>
        )}
      </div>
    </Card>
  );
}; 