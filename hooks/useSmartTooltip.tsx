import { useRef, useState, useCallback } from "react";

export const useSmartTooltip = ({
  tooltipWidth, 
  margin, 
  lingerDuration = 1000
}: {
  tooltipWidth: number;
  margin: number;
  lingerDuration?: number;
}) => {
  const [position, setPosition] = useState<'left' | 'right'>('right');
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    
    // Check if tooltip would go off right edge
    const wouldOverflow = rect.right + tooltipWidth + margin > window.innerWidth;
    setPosition(wouldOverflow ? 'left' : 'right');
  }, [tooltipWidth, margin]);

  const handleMouseEnter = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    updatePosition();
    setIsVisible(true);
  }, [updatePosition]);

  const handleMouseLeave = useCallback(() => {
    // Set a timeout before hiding the tooltip based on lingerDuration
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, lingerDuration);
  }, [lingerDuration]);

  return { 
    position, 
    triggerRef, 
    isVisible,
    handleMouseEnter,
    handleMouseLeave
  };
};