'use client'

import { useState, useEffect, useRef } from "react";
import SetCard from "./SetCard";
import { generateSetBoard, isSet, refilledBoard } from "./SetSet";
import Link from "next/link";

export default function SetAnimation() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [foundSets, setFoundSets] = useState(0);
  const [setBoard, setSetBoard] = useState(generateSetBoard("atLeastOne"));
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) {
    return <div className="w-full h-24" />; // placeholder with same height
  }
  const handleCardClick = async (index: number) => {
    if (isExiting) return; // Prevent clicks during animation

    //if card is selected, unselect it
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter((i) => i !== index));
    }
    //if we havent selected three cards yet, select the card
    else if (selectedCards.length < 3) {
      const newSelection = [...selectedCards, index];
      setSelectedCards(newSelection);

      if (newSelection.length === 3) {
        const [first, second, third] = newSelection;
        const selectedSet = [
          setBoard[first],
          setBoard[second],
          setBoard[third],
        ];

        if (isSet(selectedSet[0], selectedSet[1], selectedSet[2])) {
          setIsExiting(true);
          // Wait for fade out animation
          await new Promise((resolve) => setTimeout(resolve, 300));

          setFoundSets(foundSets + 1);
          setSelectedCards([]);
          setSetBoard(refilledBoard(setBoard, newSelection));
          setIsExiting(false);
        }
      }
    }
  };
  return (
    <div className="flex flex-col items-center gap-3 py-4" ref={containerRef}>
      <div className="grid grid-cols-6 md:grid-cols-12 gap-1 md:gap-2 w-full auto-rows-fr">
        {setBoard.map((card, index) => (
          <div
            key={`${card.shape}-${card.color}-${card.fill}-${card.number}-${index}`}
            className={`
              opacity-0 
              ${visible ? "animate-fade-in" : ""}
              ${isExiting && selectedCards.includes(index) ? "animate-fade-out" : ""}
            `}
            style={{
              animationDelay:
                isExiting || foundSets > 0 ? "0ms" : `${index * 100}ms`,
            }}
            onClick={() => handleCardClick(index)}
          >
            <SetCard
              card={card}
              size="sm"
              selected={selectedCards.includes(index)}
              responsive
            />
          </div>
        ))}
      </div>
      {foundSets > 0 && <div className="flex justify-center items-center gap-2 min-h-[4px] animate-fade-in">
        {Array.from({ length: Math.max(5, foundSets) }).map((_, index) => (
          <div
            key={index}
            className={`size-1 ${index < foundSets ? "bg-white" : "bg-gray-700 "} rounded-full shadow-lg `}
          ></div>
        ))}
      </div>}
      {foundSets >= 5 && 
      <Link href="/proset-puzzle" className="animate-fade-in bg-blue-300 text-black text-center max-w-48 md:max-w-full font-semibold px-2 py-1 rounded-md">
        Want something trickier and more rewarding?
      </Link>
      }
    </div>
  );
}
