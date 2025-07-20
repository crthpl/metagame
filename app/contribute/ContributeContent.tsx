import type { Metadata } from 'next';
import ContributeContent from './ContributeContent';

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Run something at Metagame 2025 - experimental games, hackathons, and more',
};

export default function ContributePage() {
  return <ContributeContent />;
}
