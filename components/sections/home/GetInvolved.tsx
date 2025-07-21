'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../Button';

export default function GetInvolved() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <section
        className="container rounded-xl mx-auto mb-8 bg-dark-500 border border-t border-b border-secondary-300"
        id="get-involved"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
          <div className="relative">
            <div className="relative">
              <img
                alt="Lighthaven"
                className="glitch mb-2 rounded object-cover cursor-pointer"
                src="/images/proset_1.JPG"
                onClick={openModal}
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
              <div>
                <Button link="/contribute">
                  Dooooo it
                </Button>
              </div>
            </p>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 transition-opacity duration-300 z-40 flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <div className="relative w-[85vw] max-w-4xl">
            <button 
              className="sm:hidden absolute -top-4 -right-4 w-8 h-8 bg-secondary-200 text-dark-500 rounded-full flex items-center justify-center z-50"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✕
            </button>
            <img
              alt="Lighthaven Modal"
              className="object-contain w-full h-auto max-h-[80vh]"
              src="/images/proset_puzzle_tablet.png"
            />
          </div>
        </div>
      )}
    </>
  );
} 