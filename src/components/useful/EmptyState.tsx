import React from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  onRetry?: () => void;
  buttonLabel?: string;
  className?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
                                                 icon = <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />,
                                                 title = "Aucune donnée disponible",
                                                 message = "",
                                                 onRetry,
                                                 buttonLabel = "Réessayer",
                                                 className = "",
                                               }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-[70vh] text-center text-muted-foreground ${className}`}
    >
      {icon}
      <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
      {message && (
        <p className="text-sm text-gray-500 mt-2">{message}</p>
      )}
      {onRetry && (
        <Button onClick={onRetry}  size="sm" className="mt-10 ">
          <RefreshCw className="w-4 h-4" />
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
