import Image from 'next/image'

import { Partner } from '@/lib/content'

interface PartnerCardProps {
  partner: Partner
  imgClass?: string
}

export default function PartnerCard({ partner, imgClass }: PartnerCardProps) {
  const hasWebsite = partner.website && partner.website.trim() !== ''

  const cardContent = (
    <div className="flex flex-col items-center justify-center gap-4 rounded-md border-0 border-amber-400 p-0 text-center transition-all hover:underline">
      <Image
        src={partner.logo}
        alt={`${partner.name} logo`}
        width={partner.wideLogo ? 240 : 160}
        height={80}
        className={`${imgClass || 'h-20 w-40'} object-contain`}
        loading="lazy"
      />
    </div>
  )

  if (hasWebsite) {
    return (
      <a
        className="mt-10 flex items-center justify-center text-xl font-medium"
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cardContent}
      </a>
    )
  }

  return (
    <div className="flex items-center justify-center text-xl font-medium">
      {cardContent}
    </div>
  )
}
