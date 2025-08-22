'use client'

import { useEffect, useRef, useState } from 'react'

export default function PacmanAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAnimating(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    // Start observing the container
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative w-full">
      <div className="pacman-rail"></div>

      <div
        ref={containerRef}
        className={`pacman-container ${isAnimating ? 'animate' : ''}`}
      >
        <div className="dots">
          <div className="dot-row"></div>
        </div>

        <div className="wake"></div>

        <div className="pacman"></div>
      </div>

      <div className="pacman-rail"></div>

      <style jsx>{`
        .pacman-container {
          position: relative;
          width: 100%;
          height: 50px;
          overflow: visible;
          display: flex;
          align-items: center;
          margin: 10px 0;
        }

        .pacman-rail {
          position: absolute;
          width: 100%;
          height: 3px;
          background-color: #4a9eff;
          box-shadow:
            0 0 5px #4a9eff,
            0 0 10px #4a9eff,
            0 0 15px #4a9eff;
        }

        .pacman {
          width: 30px;
          height: 30px;
          position: absolute;
          top: 15px;
          left: -25px;
        }

        .pacman::before,
        .pacman::after {
          content: '';
          display: block;
          width: 30px;
          height: 30px;
          background: transparent;
          border-radius: 50%;
          position: absolute;
          border: 15px solid yellow;
          border-right: 15px solid transparent;
        }

        .pacman::before {
          animation: chomp 0.3s ease-in-out infinite;
        }

        .pacman::after {
          animation: chomp-2 0.3s ease-in-out infinite;
        }

        .animate .pacman {
          animation: move 8s linear forwards;
          animation-delay: 1s;
        }

        @keyframes move {
          0% {
            left: -25px;
            opacity: 1;
          }
          99% {
            left: calc(100% + 25px);
            opacity: 1;
          }
          100% {
            left: calc(100% + 25px);
            opacity: 0;
          }
        }

        @keyframes chomp {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(45deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes chomp-2 {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-45deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .dots {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 25px;
        }

        .dot-row {
          width: 100%;
          height: 8px;
          background-image: radial-gradient(
            circle at center,
            white 0px,
            white 4px,
            transparent 4px,
            transparent 100%
          );
          transform: translateY(2px);
          background-size: 30px 8px;
          background-repeat: repeat-x;
          background-position: center;
        }

        .wake {
          position: absolute;
          height: 50%;
          background: #010020; /* dark-500 equivalent */
          width: calc(100% + 50px);
          transform: scaleX(0);
          transform-origin: left;
          left: -25px;
          top: 25px;
        }

        .animate .wake {
          animation: expand 8s linear forwards;
          animation-delay: 1s;
        }

        @keyframes expand {
          0% {
            transform: scaleX(0);
          }
          99%,
          100% {
            transform: scaleX(1);
          }
        }

        .animate .pacman {
          opacity: 0;
          animation: move 8s linear forwards 1s;
        }

        .animate .wake {
          transform: scaleX(0);
          animation: expand 8s linear forwards 1s;
        }
      `}</style>
    </div>
  )
}
