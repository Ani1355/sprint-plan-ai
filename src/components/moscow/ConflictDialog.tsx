import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  valueScore: number;
  effortScore: number;
  category: 'Must' | 'Should' | 'Could' | 'Won\'t';
  isMVP: boolean;
  votes: { up: number; down: number };
  estimatedEffort: 'Low' | 'Medium' | 'High';
}

interface ConflictDialogProps {
  feature: Feature | null;
  onResolve: (action: 'keep' | 'remove_mvp') => void;
  onCancel: () => void;
}

export function ConflictDialog({ feature, onResolve, onCancel }: ConflictDialogProps) {
  if (!feature) return null;

  return (
    <AlertDialog open={!!feature} onOpenChange={() => onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Conflicting Priority Detected
          </AlertDialogTitle>
          <AlertDialogDescription>
            You're trying to move <strong>"{feature.title}"</strong> to "Won't Have", 
            but this feature is currently marked as MVP. This creates a conflict in your prioritization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-2">
          <p className="text-body-small text-muted-foreground">
            What would you like to do?
          </p>
          <div className="space-y-2 text-body-small">
            <div className="p-3 bg-muted rounded-lg">
              <strong>Option 1:</strong> Move to "Won't Have" anyway (removes from MVP)
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <strong>Option 2:</strong> Move to "Could Have" instead (keeps in potential scope)
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onResolve('remove_mvp')}
            className="bg-primary hover:bg-primary/90"
          >
            Move to Could Have
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => onResolve('keep')}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Move to Won't Have
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}