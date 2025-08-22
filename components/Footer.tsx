import Link from './Link'

import { SOCIAL_LINKS } from '@/utils/urls'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="flex flex-col gap-4 px-6 py-9">
      <div className="flex justify-between gap-2">
        <div className="container mx-auto flex flex-col-reverse items-center justify-between gap-4 md:flex-row">
          <p className="text-cyan-300">
            © {year} Metagame. All rights reserved.
          </p>
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
      <div className="md:text-righ text-center text-sm font-light">
        Website design taken from{' '}
        <Link href="https://wts.sh" target="_blank" rel="noopener noreferrer">
          WhatTheStack
        </Link>
        , by courteous permission of{' '}
        <Link href="https://darko.io" target="_blank" rel="noopener noreferrer">
          Darko
        </Link>
      </div>
    </footer>
  )
}
