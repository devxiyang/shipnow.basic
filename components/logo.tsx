import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LogoProps {
  className?: string
  showText?: boolean
  textClassName?: string
  iconSize?: 'sm' | 'md' | 'lg'
  href?: string
}

const iconSizes = {
  sm: 'text-base',
  md: 'text-xl', 
  lg: 'text-2xl'
}

export function Logo({ 
  className, 
  showText = true, 
  textClassName,
  iconSize = 'md',
  href = '/'
}: LogoProps) {
  const logoContent = (
    <>
      {/* ShipNow logo */}
      <div className={cn(iconSizes[iconSize])}>
        🚀
      </div>
      {showText && (
        <div className={cn(
          "font-semibold text-muted-foreground",
          iconSize === 'lg' ? 'text-lg' : iconSize === 'sm' ? 'text-sm' : 'text-base',
          textClassName
        )}>
          ShipNow
        </div>
      )}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 hover:opacity-80 transition-opacity",
          iconSize === 'lg' && 'gap-3',
          className
        )}
        aria-label="ShipNow - Go to homepage"
      >
        {logoContent}
      </Link>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", iconSize === 'lg' && 'gap-3', className)}>
      {logoContent}
    </div>
  )
} 