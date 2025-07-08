import { 
  Shield, 
  CreditCard, 
  Code2, 
  Zap, 
  Users, 
  CheckCircle2,
  LucideIcon 
} from "lucide-react";

// Icon mapping for template configuration
const iconMap: Record<string, LucideIcon> = {
  Shield,
  CreditCard,
  Code2,
  Zap,
  Users,
  CheckCircle2,
};

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className = "h-6 w-6" }: DynamicIconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return <div className={className} />; // Fallback
  }
  
  return <IconComponent className={className} />;
}