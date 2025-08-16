"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipContext = React.createContext<{
  clickable: boolean
  open?: boolean
  setOpen?: (open: boolean) => void
  hoverTimeoutRef?: React.RefObject<NodeJS.Timeout | null>
}>({ clickable: false })

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

interface TooltipProps extends React.ComponentProps<typeof TooltipPrimitive.Root> {
  clickable?: boolean
}

function Tooltip({
  clickable = false,
  ...props
}: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const contextValue = React.useMemo(() => ({
    clickable,
    open,
    setOpen,
    hoverTimeoutRef
  }), [clickable, open])

  if (clickable) {
    return (
      <TooltipContext.Provider value={contextValue}>
        <TooltipProvider>
          <TooltipPrimitive.Root 
            data-slot="tooltip" 
            open={open}
            onOpenChange={setOpen}
            {...props} 
          />
        </TooltipProvider>
      </TooltipContext.Provider>
    )
  }

  return (
    <TooltipContext.Provider value={contextValue}>
      <TooltipProvider>
        <TooltipPrimitive.Root data-slot="tooltip" {...props} />
      </TooltipProvider>
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const { clickable, open, setOpen, hoverTimeoutRef } = React.useContext(TooltipContext)
  
  if (clickable && setOpen && hoverTimeoutRef) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e)
      // Clear any pending close timeout when clicking
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      setOpen(!open)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onMouseEnter) onMouseEnter(e)
      // Clear any pending close timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      setOpen(true)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onMouseLeave) onMouseLeave(e)
      // Set a timeout to close, which can be cancelled if mouse enters content
      hoverTimeoutRef.current = setTimeout(() => {
        setOpen(false)
        hoverTimeoutRef.current = null
      }, 150) // Short delay to allow moving to content
    }

    return (
      <TooltipPrimitive.Trigger 
        data-slot="tooltip-trigger" 
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props} 
      />
    )
  }

  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const { clickable, setOpen, hoverTimeoutRef } = React.useContext(TooltipContext)

  if (clickable && setOpen && hoverTimeoutRef) {
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onMouseEnter) onMouseEnter(e)
      // Cancel any pending close timeout when hovering over content
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onMouseLeave) onMouseLeave(e)
      // Set timeout to close when leaving content
      hoverTimeoutRef.current = setTimeout(() => {
        setOpen(false)
        hoverTimeoutRef.current = null
      }, 150)
    }

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          data-slot="tooltip-content"
          sideOffset={sideOffset}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "bg-bg-tertiary text-primary animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit max-w-[calc(100vw-2rem)] sm:max-w-80 origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance text-center",
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="bg-bg-tertiary fill-bg-tertiary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    )
  }

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-bg-tertiary text-primary animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit max-w-[calc(100vw-2rem)] sm:max-w-80 origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance text-center",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-bg-tertiary fill-bg-tertiary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
