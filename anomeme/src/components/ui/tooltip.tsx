"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function Tooltip({ 
  children, 
  content, 
  position = 'top', 
  delay = 300,
  className = ""
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [finalPosition, setFinalPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        
        let x = rect.left + rect.width / 2;
        let y = rect.top;
        let finalPosition = position;
        
        // Smart positioning based on viewport boundaries
        const tooltipHeight = 120; // Estimated tooltip height
        const tooltipWidth = 300;  // Max tooltip width
        
        switch (position) {
          case 'bottom':
            y = rect.bottom + 12;
            // If too close to bottom, flip to top
            if (y + tooltipHeight > viewport.height - 20) {
              y = rect.top - 12;
              finalPosition = 'top';
            }
            break;
          case 'top':
            y = rect.top - 12;
            // If too close to top, flip to bottom
            if (y - tooltipHeight < 20) {
              y = rect.bottom + 12;
              finalPosition = 'bottom';
            }
            break;
          case 'left':
            x = rect.left - 12;
            y = rect.top + rect.height / 2;
            // If too close to left, flip to right
            if (x - tooltipWidth < 20) {
              x = rect.right + 12;
              finalPosition = 'right';
            }
            break;
          case 'right':
            x = rect.right + 12;
            y = rect.top + rect.height / 2;
            // If too close to right, flip to left
            if (x + tooltipWidth > viewport.width - 20) {
              x = rect.left - 12;
              finalPosition = 'left';
            }
            break;
        }
        
        // Ensure tooltip stays within viewport horizontally
        if (finalPosition === 'top' || finalPosition === 'bottom') {
          const halfWidth = tooltipWidth / 2;
          if (x - halfWidth < 20) x = halfWidth + 20;
          if (x + halfWidth > viewport.width - 20) x = viewport.width - halfWidth - 20;
        }
        
        // Ensure tooltip stays within viewport vertically
        if (finalPosition === 'left' || finalPosition === 'right') {
          const halfHeight = tooltipHeight / 2;
          if (y - halfHeight < 20) y = halfHeight + 20;
          if (y + halfHeight > viewport.height - 20) y = viewport.height - halfHeight - 20;
        }
        
        // Final safety check - never go outside viewport
        if (finalPosition === 'top' && y - tooltipHeight < 20) {
          // If still too close to top after flip, force bottom position
          y = rect.bottom + 12;
          finalPosition = 'bottom';
        }
        if (finalPosition === 'bottom' && y + tooltipHeight > viewport.height - 20) {
          // If still too close to bottom after flip, force top position with safe margin
          y = Math.max(tooltipHeight + 20, rect.top - 12);
          finalPosition = 'top';
        }
        
        setCoords({ x, y });
        // Store final position for arrow direction
        setFinalPosition(finalPosition);
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getPositionClasses = () => {
    switch (finalPosition) {
      case 'bottom':
        return 'translate-x-[-50%] translate-y-0';
      case 'top':
        return 'translate-x-[-50%] translate-y-[-100%]';
      case 'left':
        return 'translate-x-[-100%] translate-y-[-50%]';
      case 'right':
        return 'translate-x-0 translate-y-[-50%]';
      default:
        return 'translate-x-[-50%] translate-y-[-100%]';
    }
  };

  const getArrowClasses = () => {
    const baseArrow = 'absolute w-2 h-2 bg-black/95 border-l border-t border-red-500/40 rotate-45';
    switch (finalPosition) {
      case 'bottom':
        return `${baseArrow} top-[-4px] left-1/2 translate-x-[-50%]`;
      case 'top':
        return `${baseArrow} bottom-[-4px] left-1/2 translate-x-[-50%] rotate-[225deg]`;
      case 'left':
        return `${baseArrow} right-[-4px] top-1/2 translate-y-[-50%] rotate-[135deg]`;
      case 'right':
        return `${baseArrow} left-[-4px] top-1/2 translate-y-[-50%] rotate-[315deg]`;
      default:
        return `${baseArrow} bottom-[-4px] left-1/2 translate-x-[-50%] rotate-[225deg]`;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className={`inline-block cursor-help ${className}`}
      >
        {children}
      </div>
      
      {isVisible && typeof window !== 'undefined' && document.body && 
        createPortal(
          <div
            className="tooltip-overlay animate-fade-in-up"
            style={{
              left: coords.x,
              top: coords.y,
            }}
          >
            <div className={`relative ${getPositionClasses()}`}>
              <div className="bg-black/95 border border-red-500/40 backdrop-blur-xl px-4 py-3 text-xs font-mono text-white max-w-[300px] shadow-2xl rounded-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0 animate-red-glow"></div>
                  <div className="leading-relaxed text-white/90">
                    {content}
                  </div>
                </div>
              </div>
              <div className={getArrowClasses()}></div>
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
}
