import { ReactNode } from 'react'

import NextLink from 'next/link'

type Props = {
  href: string
  rel?: string
  target?: string
  children: ReactNode
  className?: string
}

export default function Link({
  href,
  rel,
  target,
  children,
  className = '',
}: Props) {
  return (
    <NextLink
      href={href}
      className={`text-secondary-500 transition-colors hover:text-fuchsia-500 hover:underline ${className}`}
      target={target}
      rel={rel}
    >
      {children}
    </NextLink>
  )
}
