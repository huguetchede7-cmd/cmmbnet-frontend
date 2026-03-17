import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react"

//type LucideIconName = keyof typeof LucideIcons;

interface LucideIconProps extends LucideProps {
  name: string;
  fallback?: React.ReactNode;
}

export function LucideIcon({
                             name,
                             fallback = null,
                             ...props
                           }: LucideIconProps) {
  const Icon = (LucideIcons as Record<string, any>)[name] as
    | React.FC<LucideProps>
    | undefined;
  if (!Icon) {
    return <>{fallback}</>;
  }

  return <Icon {...props} />;
}
