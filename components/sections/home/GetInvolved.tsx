'use client';

import React from 'react';
import { Button } from '../../Button';
import Image from 'next/image';

export default function GetInvolved() {

  return (
    <>
      <section
        className="container rounded-xl mx-auto mb-8 bg-dark-500 border border-t border-b border-secondary-300"
        id="get-involved"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
          <div className="relative">
            <div className="relative">
              <Image
                alt="Lighthaven"
                className="glitch mb-2 rounded object-cover"
                src="/images/lighthaven_chess.JPG"
                width={600}
                height={600}
              />
            </div>
          </div>
          <div>
            <h2 className="mb-8 text-2xl font-bold text-secondary-200">
              Run something
            </h2>
            <p className="mb-4 font-semibold">
              We will provide the venue, the resources, and the very eager audience, and you can run whatever experimental game concept you&apos;ve been toying with.
              <br />  
              <br />
              Need a weirdly shaped space to build a gradient descent themed escape room? Want to run a game design tournament where you provide the board and pieces and contestants come up with the rules? Looking for hundreds of willing subjects for a social deception experiment that isn&apos;t quite ready for prime time? 
              <br />
              <br />
              Metagame is the conference for you.
              <br />
              <br />
                <Button link="/contribute">
                  Dooooo it
                </Button>
            </p>
          </div>
        </div>
      </section>
    </>
  );
} 