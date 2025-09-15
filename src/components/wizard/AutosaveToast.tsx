import { useEffect } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutosaveToastProps {
  status: "saving" | "saved" | "error" | null;
  lastSaved: Date | null;
  onStatusChange: (status: "saving" | "saved" | "error" | null) => void;
}

export function AutosaveToast({ status, lastSaved, onStatusChange }: AutosaveToastProps) {
  useEffect(() => {
    if (status === "saved") {
      const timer = setTimeout(() => {
        onStatusChange(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, onStatusChange]);

  if (!status) return null;

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className={cn(
      "fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-200",
      "bg-card border border-border text-card-foreground",
      "animate-fade-in"
    )}>
      {status === "saving" && (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Saving...</span>
        </>
      )}
      
      {status === "saved" && (
        <>
          <CheckCircle className="w-3 h-3 text-success" />
          <span className="text-xs text-muted-foreground">
            Saved {lastSaved ? `• ${formatTimeAgo(lastSaved)}` : ""}
          </span>
        </>
      )}
      
      {status === "error" && (
        <>
          <AlertCircle className="w-3 h-3 text-error" />
          <span className="text-xs text-error">Save failed</span>
        </>
      )}
    </div>
  );
}