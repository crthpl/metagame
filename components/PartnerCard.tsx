import { Partner } from '@/lib/content';

interface PartnerCardProps {
  partner: Partner;
  imgClass?: string;
}

export default function PartnerCard({ partner, imgClass }: PartnerCardProps) {
  const hasWebsite = partner.website && partner.website.trim() !== '';

  const cardContent = (
    <div className="rounded-md border-amber-400 transition-all text-center flex flex-col border-0 p-0 gap-4 items-center justify-center hover:underline">
      <img
        className={`${imgClass || ''} ${partner.wideLogo ? 'w-60' : ''}`}
        src={partner.logo}
        alt={`${partner.name} logo`}

        loading="lazy"
      />
    </div>
  );

  if (hasWebsite) {
    return (
      <a
        className="font-medium text-xl mt-10 flex items-center justify-center"
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div className="font-medium text-xl flex items-center justify-center">
      {cardContent}
    </div>
  );
} 