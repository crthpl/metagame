import { useRef, useState } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const SessionTooltip = ({
  children,
  tooltip,
  tooltipWidth = 480,
  margin = 20,
}: {
  children: React.ReactNode
  tooltip: React.ReactNode
  tooltipWidth?: number
  margin?: number
}) => {
  const [side, setSide] = useState<'top' | 'right' | 'bottom' | 'left'>('right')
  const [align, setAlign] = useState<'start' | 'center' | 'end'>('start')
  const triggerRef = useRef<HTMLDivElement>(null)

  const updatePosition = () => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Calculate available space on each side
    const spaceRight = viewportWidth - rect.right - margin
    const spaceLeft = rect.left - margin
    const spaceTop = rect.top - margin
    const spaceBottom = viewportHeight - rect.bottom - margin

    // Determine horizontal side (left/right)
    let newSide: 'top' | 'right' | 'bottom' | 'left'
    if (spaceRight >= tooltipWidth) {
      newSide = 'right'
    } else if (spaceLeft >= tooltipWidth) {
      newSide = 'left'
    } else {
      // If neither side has enough space, choose the side with more space
      newSide = spaceRight > spaceLeft ? 'right' : 'left'
    }

    // Determine vertical alignment
    let newAlign: 'start' | 'center' | 'end'
    const tooltipHeight = 400 // Approximate height

    if (newSide === 'right' || newSide === 'left') {
      // For left/right positioning, check vertical space
      if (spaceTop >= tooltipHeight) {
        newAlign = 'start'
      } else if (spaceBottom >= tooltipHeight) {
        newAlign = 'end'
      } else {
        newAlign = 'center'
      }
    } else {
      // For top/bottom positioning, check horizontal space
      if (spaceLeft >= tooltipWidth / 2) {
        newAlign = 'start'
      } else if (spaceRight >= tooltipWidth / 2) {
        newAlign = 'end'
      } else {
        newAlign = 'center'
      }
    }

    setSide(newSide)
    setAlign(newAlign)
  }

  return (
    <Tooltip clickable showArrow={false}>
      <TooltipTrigger asChild>
        <div ref={triggerRef} onMouseEnter={updatePosition}>
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={margin}
        className="z-[100] max-w-none border-none bg-transparent p-0 text-left shadow-none"
        style={{
          width: `${tooltipWidth}px`,
          maxHeight: 'calc(100vh - 100px)',
        }}
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}
