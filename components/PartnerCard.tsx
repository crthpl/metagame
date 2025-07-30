import { Partner } from '@/lib/content';
import Image from 'next/image';

interface PartnerCardProps {
  partner: Partner;
  imgClass?: string;
}

export default function PartnerCard({ partner, imgClass }: PartnerCardProps) {
  const hasWebsite = partner.website && partner.website.trim() !== '';

  const cardContent = (
    <div className="rounded-md border-amber-400 transition-all text-center flex flex-col border-0 p-0 gap-4 items-center justify-center hover:underline">
      <Image
        src={partner.logo}
        alt={`${partner.name} logo`}
        width={partner.wideLogo ? 240 : 160}
        height={80}
        className={`${imgClass || 'h-20 w-40'} object-contain`}
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