import { useSmartTooltip } from "@/hooks/useSmartTooltip";

export const SmartTooltip = ({ 
  children, 
  tooltip, 
  tooltipWidth = 480, 
  margin = 20 
}: {
  children: React.ReactNode;
  tooltip: React.ReactNode;
  tooltipWidth?: number;
  margin?: number;
}) => {
  const { position, triggerRef, updatePosition } = useSmartTooltip({tooltipWidth, margin});

  return (
    <div 
      className="group" 
      ref={triggerRef}
      onMouseEnter={updatePosition}
    >
      {children}
      
      {/* Invisible bridge to prevent gap issues */}
      <div 
        className={`absolute top-0 h-full w-[180px] group-hover:block hidden ${
          position === 'right' ? 'left-0' : 'right-0'
        }`}
      />
      
      {/* Actual tooltip */}
      <div 
        className={`absolute top-0 max-h-[calc(100vh-100px)] z-modal group-hover:block hidden ${
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