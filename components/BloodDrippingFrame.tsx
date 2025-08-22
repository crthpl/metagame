'use client'

import React from 'react'

interface BloodDrippingFrameProps {
  children: React.ReactNode
  className?: string
}

export function BloodDrippingFrame({
  children,
  className = '',
}: BloodDrippingFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {children}

      {/* Blood droplets overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        {/* Top edge droplets - smaller and thinner */}

        <div
          className="absolute top-0 left-[65%] h-2.5 w-1.5 opacity-95"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 30%, #7f1d1d 0%, #991b1b 40%, #450a0a 100%)',
            borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
            filter: 'drop-shadow(0 1px 3px rgba(153, 27, 27, 0.6))',
          }}
        ></div>

        <div
          className="absolute top-0 left-[82%] h-3.5 w-2 opacity-98"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 30%, #7f1d1d 0%, #991b1b 40%, #450a0a 100%)',
            borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
            filter: 'drop-shadow(0 1px 3px rgba(153, 27, 27, 0.6))',
          }}
        ></div>

        {/* Medium droplets hanging lower - smaller */}
        <div
          className="absolute top-3 left-[18%] h-1.5 w-1.5 rounded-full opacity-95"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #991b1b 0%, #7f1d1d 60%, #450a0a 100%)',
            filter: 'drop-shadow(0 1px 2px rgba(153, 27, 27, 0.5))',
          }}
        ></div>
        <div
          className="absolute top-[80%] left-[60%] h-2 w-1.5 rounded-full opacity-95 blur-[0.5px]"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #991b1b 0%, #7f1d1d 60%, #450a0a 100%)',
            filter: 'drop-shadow(0 1px 2px rgba(153, 27, 27, 0.5))',
          }}
        ></div>

        <div
          className="absolute top-4 left-[35%] h-2 w-1 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 30%, #7f1d1d 0%, #991b1b 40%, #450a0a 100%)',
            borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
            filter: 'drop-shadow(0 1px 2px rgba(153, 27, 27, 0.5))',
          }}
        ></div>

        <div
          className="absolute top-6 left-[55%] h-1 w-1 rounded-full opacity-85"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #991b1b 0%, #7f1d1d 60%, #450a0a 100%)',
            filter: 'drop-shadow(0 1px 2px rgba(153, 27, 27, 0.5))',
          }}
        ></div>

        <div
          className="absolute top-4 left-[72%] h-2 w-1.5 opacity-95"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 30%, #7f1d1d 0%, #991b1b 40%, #450a0a 100%)',
            borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
            filter: 'drop-shadow(0 1px 2px rgba(153, 27, 27, 0.5))',
          }}
        ></div>

        {/* Small droplets scattered */}
        <div
          className="absolute top-5 left-[25%] h-0.5 w-0.5 rounded-full opacity-80"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #991b1b 0%, #7f1d1d 60%, #450a0a 100%)',
            filter: 'drop-shadow(0 1px 1px rgba(153, 27, 27, 0.4))',
          }}
        ></div>

        <div
          className="absolute top-7 left-[42%] h-0.5 w-0.5 rounded-full opacity-75"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #991b1b 0%, #7f1d1d 60%, #450a0a 100%)',
            filter: 'drop-shadow(0 1px 1px rgba(153, 27, 27, 0.4))',
          }}
        ></div>

        <div
          className="absolute top-8 left-[68%] h-0.5 w-0.5 rounded-full opacity-70"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #991b1b 0%, #7f1d1d 60%, #450a0a 100%)',
            filter: 'drop-shadow(0 1px 1px rgba(153, 27, 27, 0.4))',
          }}
        ></div>

        {/* Side edge droplets - inside boundary */}

        <div
          className="absolute top-[55%] left-0 h-1 w-0.5 opacity-80"
          style={{
            background:
              'radial-gradient(ellipse 100% 80% at 100% 50%, #7f1d1d 0%, #991b1b 40%, #450a0a 100%)',
            borderRadius: '80% 20% 80% 20%',
            filter: 'drop-shadow(0 1px 2px rgba(153, 27, 27, 0.5))',
          }}
        ></div>

        {/* External dripping droplets - outside image boundary */}

        <div
          className="absolute top-1 -right-0.5 h-4 w-1 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 30%, #7f1d1d 0%, #991b1b 40%, #450a0a 100%)',
            borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
            filter: 'drop-shadow(0 1px 3px rgba(153, 27, 27, 0.6))',
          }}
        ></div>

        <div
          className="absolute top-6 -left-0.5 h-2 w-0.5 opacity-85"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 30%, #7f1d1d 0%, #991b1b 40%, #450a0a 100%)',
            borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
            filter: 'drop-shadow(0 1px 2px rgba(153, 27, 27, 0.5))',
          }}
        ></div>

        <div
          className="absolute top-8 -right-0.5 h-1.5 w-0.5 opacity-80"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 30%, #7f1d1d 0%, #991b1b 40%, #450a0a 100%)',
            borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
            filter: 'drop-shadow(0 1px 2px rgba(153, 27, 27, 0.5))',
          }}
        ></div>

        <div
          className="absolute top-12 -left-0.5 h-1 w-0.5 opacity-75"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #991b1b 0%, #7f1d1d 60%, #450a0a 100%)',
            filter: 'drop-shadow(0 1px 1px rgba(153, 27, 27, 0.4))',
          }}
        ></div>

        <div
          className="absolute top-14 -right-0.5 h-0.5 w-0.5 rounded-full opacity-70"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #991b1b 0%, #7f1d1d 60%, #450a0a 100%)',
            filter: 'drop-shadow(0 1px 1px rgba(153, 27, 27, 0.4))',
          }}
        ></div>

        {/* Glistening highlights on droplets - smaller */}
        <div className="absolute top-0.5 left-[13%] h-0.5 w-0.5 rounded-full bg-red-300 opacity-75 blur-[0.5px]"></div>
        <div className="absolute top-0.5 left-[46%] h-0.5 w-0.5 rounded-full bg-red-200 opacity-85 blur-[0.5px]"></div>
        <div className="absolute top-3.5 left-[19%] h-0.5 w-0.5 rounded-full bg-red-300 opacity-65 blur-[0.5px]"></div>
        <div className="absolute top-4.5 left-[73%] h-0.5 w-0.5 rounded-full bg-red-200 opacity-75 blur-[0.5px]"></div>
        <div className="absolute top-0.5 left-[83%] h-0.5 w-0.5 rounded-full bg-red-300 opacity-70 blur-[0.5px]"></div>
      </div>
    </div>
  )
}
