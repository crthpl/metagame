import type { Metadata } from 'next'
import ContributeContent from '@/components/ContributeContent'

export const metadata: Metadata = {
  title: 'Get Involved',
  description:
    'Run something at Metagame 2025 - experimental games, hackathons, and more',
}

export default function ContributePage() {
  return (
    <>
      {/* Hide the global hero animation for the contribute page */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          html::before {
            display: none !important;
          }
          body {
            background: #010020 !important;
          }
        `,
        }}
      />
      <ContributeContent />
    </>
  )
}
