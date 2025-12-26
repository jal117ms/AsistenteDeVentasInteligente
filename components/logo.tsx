import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  priority?: boolean
  withShadow?: boolean
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8", 
  lg: "w-12 h-12",
  xl: "w-16 h-16"
}

export function Logo({ size = "md", className, priority = false, withShadow = true }: LogoProps) {
  return (
    <div className={cn(
      "relative logo-container", 
      sizeClasses[size], 
      withShadow && "logo-shadow",
      className
    )}>
      <Image
        src="/Logo.png"
        alt="Asistente de Ventas Inteligente"
        fill
        className="object-contain rounded-full"
        priority={priority}
        sizes="(max-width: 768px) 32px, 64px"
      />
    </div>
  )
}