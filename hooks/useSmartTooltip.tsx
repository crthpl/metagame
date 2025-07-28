import { useRef, useState } from "react";

export const useSmartTooltip = ({tooltipWidth, margin}: {tooltipWidth: number, margin: number}) => {
  const [position, setPosition] = useState<'left' | 'right'>('right');
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    
    // Check if tooltip would go off right edge
    const wouldOverflow = rect.right + tooltipWidth + margin > window.innerWidth;
    setPosition(wouldOverflow ? 'left' : 'right');
  };

  return { position, triggerRef, updatePosition };
};