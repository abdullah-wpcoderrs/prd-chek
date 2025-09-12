"use client";

import { InteractiveButton } from "@/components/ui/interactive-button";
import { useRouter } from "next/navigation";

interface CreateCustomButtonProps {
  className?: string;
  style?: React.CSSProperties;
  hoverColor?: string;
  defaultColor?: string;
}

export function CreateCustomButton({ 
  className, 
  style, 
  hoverColor, 
  defaultColor 
}: CreateCustomButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    // Clear any existing template data
    sessionStorage.removeItem('selectedTemplate');
    router.push('/dashboard');
  };

  return (
    <InteractiveButton 
      className={className}
      style={style}
      hoverColor={hoverColor}
      defaultColor={defaultColor}
      onClick={handleClick}
    >
      Create Custom Documentation
    </InteractiveButton>
  );
}