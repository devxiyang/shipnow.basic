import { Loader2 } from "lucide-react";

interface LoadingProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

const sizeMap = {
  sm: "w-4 h-4",
  default: "w-6 h-6",
  lg: "w-8 h-8"
};

export function Loading({ className = "", size = "default" }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-muted-foreground`} />
    </div>
  );
}

 