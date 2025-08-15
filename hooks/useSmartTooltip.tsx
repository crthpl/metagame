import { useRef, useState, useCallback, useEffect } from "react";

export const useSmartTooltip = ({
  tooltipWidth, 
  margin, 
  lingerDuration = 1000,
  onOpen,
  onClose
}: {
  tooltipWidth: number;
  margin: number;
  lingerDuration?: number;
  onOpen?: () => void;
  onClose?: () => void;
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
    onOpen?.();
  }, [updatePosition, onOpen]);

  const handleMouseLeave = useCallback(() => {
    // Set a timeout before hiding the tooltip based on lingerDuration
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, lingerDuration);
  }, [lingerDuration, onClose]);

  const close = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { 
    position, 
    triggerRef, 
    isVisible,
    handleMouseEnter,
    handleMouseLeave,
    close
  };
};