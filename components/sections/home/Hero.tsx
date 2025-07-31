'use client';

import React, { useEffect } from 'react';
import { Button } from '../../Button';
import { Typer } from '../../Typer';
import './Hero.css';

const gameNames = ["board games", "card games", "puzzle hunts", "LARPS", "video games", "escape rooms", "RPGs", "calvinball"];

export const Hero: React.FC = () => {
  useEffect(() => {
    // Only run animation on non-mobile devices
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (!isMobile) {
      const r = document.querySelector(":root") as HTMLElement;

      let dt = 0;
      let prevtime = 0;
      let outrun = 0;
      
      function doAnimationStep(timeStamp: DOMHighResTimeStamp) {
        dt = (timeStamp - prevtime) / 1000;
        prevtime = timeStamp;
        outrun = (outrun + dt) % 1;

        r.style.setProperty("--outrun", `${outrun}`);
        requestAnimationFrame(doAnimationStep);
      }
      
      const animationId = requestAnimationFrame(doAnimationStep);
      
      // Cleanup function
      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, []);

  return (
    <section
      className="h-[80vh] flex flex-col items-center justify-center pb-2 px-0 md:px-12"
      id="hero"
    >
      <div className="flex flex-col items-center justify-center max-w-prose">
        <h1 id="hero-title" className="text-center w-full mb-10 text-4xl font-semibold tracking-wider md:text-6xl max-w-prose glitch">
          METAGAME 2025 <br />
          <span className="text-white uppercase font-black outlines">
            <Typer
              blinkerClass="text-white"
              texts={gameNames} 
            />
          </span>
        </h1>
        <p className="text-lg text-center md:text-xl max-w-prose mb-8 font-black">
          <span className="text-amber-300" data-glitchies='{ "totalClones": 2 }'>
            A conference about game design, strategy, narrative, and play. Join us September 12-14 in Berkeley, California.
          </span>
        </p>
        <Button id="hero-cta-button" background="bg-cyan-500" link="#tickets">GET YOUR TICKET</Button>
      </div>
    </section>
  );
}; 