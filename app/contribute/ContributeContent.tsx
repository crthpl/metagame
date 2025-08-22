import ContributeContent from './ContributeContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Involved',
  description:
    'Run something at Metagame 2025 - experimental games, hackathons, and more',
}

export default function ContributePage() {
  return <ContributeContent />
}
