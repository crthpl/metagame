import React from 'react';
import { getSpeakers } from '@/lib/content';
import Speakers from './Speakers';

export default async function SpeakersWrapper() {
  const speakers = await getSpeakers();

  return <Speakers speakers={speakers} />;
} 