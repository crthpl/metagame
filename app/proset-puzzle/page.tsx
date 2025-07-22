import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'A Blind Game of Projective Set',
  description: 'Projective Set puzzle by Eric Neyman - solve for a discount on your Metagame ticket',
};

export default function ProsetPuzzlePage() {
  return (
    <>
      {/* Override the global animated background for a clean page */}
      <style dangerouslySetInnerHTML={{
        __html: `
          html::before {
            display: none !important;
          }
          body {
            background: #010020 !important;
          }
        `
      }} />
      <main className="flex flex-col items-center justify-center w-full p-6 dark:text-white">
        <div className="max-w-4xl text-center space-y-6">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mt-12 mb-4">
            A Blind Game of Projective Set
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-2xl md:text-3xl text-secondary-500 mb-0">
            By Eric Neyman
          </h2>
          
          {/* Image */}
          <div className="flex justify-center mb-0">
            <Image
              src="/proset-puzzle.png"
              alt="Projective Set Puzzle"
              width={800}
              height={600}
              className="rounded-lg shadow-lg max-w-full h-auto"
              priority
            />
          </div>
          
          {/* Text */}
          <p className="text-lg md:text-xl text-gray-200 font-medium italic mb-12">
            Enter the 5-letter solution at checkout for $100 off your ticket price
          </p>
        </div>
      </main>
    </>
  );
} 