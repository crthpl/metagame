import { useSmartTooltip } from "@/hooks/useSmartTooltip";
import { forwardRef, useImperativeHandle } from "react";

export interface SmartTooltipHandle {
  close: () => void;
}

interface SmartTooltipProps {
  children: React.ReactNode;
  tooltip: React.ReactNode;
  tooltipWidth?: number;
  margin?: number;
  lingerDuration?: number;
  onOpen?: () => void;
  onClose?: () => void;
}

export const SmartTooltip = forwardRef<SmartTooltipHandle, SmartTooltipProps>(({ 
  children, 
  tooltip, 
  tooltipWidth = 480, 
  margin = 20,
  lingerDuration = 1000,
  onOpen,
  onClose
}, ref) => {
  const { position, triggerRef, isVisible, handleMouseEnter, handleMouseLeave, close } = useSmartTooltip({
    tooltipWidth, 
    margin, 
    lingerDuration,
    onOpen,
    onClose
  });

  useImperativeHandle(ref, () => ({
    close
  }), [close]);

  return (
    <div 
      className="group" 
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Invisible bridge to prevent gap issues */}
      <div 
        className={`absolute top-0 h-full w-[180px] ${isVisible ? 'block' : 'hidden'} ${
          position === 'right' ? 'left-0' : 'right-0'
        }`}
      />
      
      {/* Actual tooltip */}
      <div 
        className={`absolute top-0 max-h-[calc(100vh-100px)] z-modal ${isVisible ? 'block' : 'hidden'} ${
          position === 'right' 
            ? 'left-[180px]' 
            : 'right-[180px]'
        }`}
        style={{
          width: `${tooltipWidth}px`,
        }}
      >
        {tooltip}
      </div>
    </div>
  );
});

SmartTooltip.displayName = 'SmartTooltip';