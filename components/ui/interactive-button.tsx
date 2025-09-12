"use client";

import { Button } from "@/components/ui/button";
import { forwardRef } from "react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface InteractiveButtonProps extends 
  React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  hoverColor?: string;
  defaultColor?: string;
  asChild?: boolean;
}

const InteractiveButton = forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ hoverColor, defaultColor, style, children, ...props }, ref) => {
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (hoverColor) {
        e.currentTarget.style.backgroundColor = hoverColor;
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (defaultColor) {
        e.currentTarget.style.backgroundColor = defaultColor;
      }
    };

    return (
      <Button
        ref={ref}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

InteractiveButton.displayName = "InteractiveButton";

export { InteractiveButton };