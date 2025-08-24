import { cva } from 'class-variance-authority'
import Image from 'next/image'

import { cn } from '@/lib/utils'

const ringVariants = cva('', {
  variants: {
    team: {
      orange: 'ring-orange-500',
      purple: 'ring-purple-500',
    },
    size: {
      small: 'ring-2',
      medium: 'ring-4',
      large: 'ring-8',
    },
  },
})

interface ProfilePictureProps {
  src?: string | null
  alt: string
  size: number
  team?: 'orange' | 'purple' | null
  className?: string
  fallbackText?: string
  ringSize?: 'small' | 'medium' | 'large'
}

export function ProfilePicture({
  src,
  alt,
  size,
  team,
  className,
  fallbackText = '?',
  ringSize = 'medium',
}: ProfilePictureProps) {
  const teamRingClass = team ? ringVariants({ team, size: ringSize }) : ''

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn(
          'aspect-square rounded-full object-cover',
          teamRingClass,
          className,
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-muted text-muted-foreground',
        teamRingClass,
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(12, size * 0.4), // Scale font size with container
      }}
    >
      <span className="font-bold">{fallbackText}</span>
    </div>
  )
}
