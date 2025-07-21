'use client';

import React, { useState, useEffect } from 'react';
import { SpeakerCard } from '../../SpeakerCard';
import { Button } from '../../Button';
import { MetagamePopup } from '../../MetagamePopup';
import type { Speaker } from '@/lib/content';
import { CALL_FOR_SESSIONS } from '@/config';

interface SpeakersProps {
  speakers: Speaker[];
}

export default function Speakers({ speakers }: SpeakersProps) {
  const [showMetagamePopup, setShowMetagamePopup] = useState(false);

  useEffect(() => {
    // Check for metagame URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const isMetagame = urlParams.get('metagame') === 'true';
    
    if (isMetagame) {
      // Scroll to speakers section
      const speakersSection = document.getElementById('speakers');
      if (speakersSection) {
        speakersSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Show popup after a short delay to allow scroll to complete
      setTimeout(() => {
        setShowMetagamePopup(true);
      }, 1000);
      
      // Remove the metagame parameter from URL without reloading
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('metagame');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, []);

  const closeMetagamePopup = () => {
    setShowMetagamePopup(false);
  };

  return (
    <>
      <section className="mb-[40px] pt-10 text-center" id="speakers">
        <div className="container mx-auto relative">
          <h2 className="mb-8 text-3xl font-bold text-center">Speakers</h2>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 max-w-8xl mx-auto">
            {speakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                name={speaker.name}
                image={speaker.image}
                gameName={speaker.gameName}
                gameUrl={speaker.gameUrl}
                gameName2={speaker.gameName2}
                gameUrl2={speaker.gameUrl2}
                slug={speaker.slug}
              />
            ))}
          </div>

          <div className="mt-8">
            <Button background="bg-cyan-500" link={CALL_FOR_SESSIONS} target="_blank">
              Submit a session proposal
            </Button>
          </div>
        </div>
      </section>

      <MetagamePopup 
        isOpen={showMetagamePopup}
        onClose={closeMetagamePopup}
      />
    </>
  );
} 