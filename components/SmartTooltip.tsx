import { useSmartTooltip } from "@/hooks/useSmartTooltip";

export const SmartTooltip = ({ 
  children, 
  tooltip, 
  tooltipWidth = 480, 
  margin = 20,
  lingerDuration = 1000
}: {
  children: React.ReactNode;
  tooltip: React.ReactNode;
  tooltipWidth?: number;
  margin?: number;
  lingerDuration?: number;
}) => {
  const { position, triggerRef, isVisible, handleMouseEnter, handleMouseLeave } = useSmartTooltip({
    tooltipWidth, 
    margin, 
    lingerDuration
  });

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
};