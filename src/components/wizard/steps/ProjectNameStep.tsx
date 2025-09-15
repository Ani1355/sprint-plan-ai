import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProjectNameStepProps {
  value: string;
  onChange: (value: string) => void;
}

const EXAMPLE_NAMES = [
  "AI Design Assistant",
  "Smart Task Manager", 
  "Recipe Sharing Hub",
  "Fitness Tracker Pro"
];

export function ProjectNameStep({ value, onChange }: ProjectNameStepProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (error && newValue.trim()) {
      setError(null);
    }
  };

  const useExample = () => {
    const randomName = EXAMPLE_NAMES[Math.floor(Math.random() * EXAMPLE_NAMES.length)];
    onChange(randomName);
    setError(null);
  };

  const validateName = (name: string) => {
    if (!name.trim()) {
      setError("Project name is required");
      return false;
    }
    // Simulate duplicate check
    if (name.toLowerCase() === "existing project") {
      setError("A project with this name already exists. Consider adding a suffix or choosing a different name.");
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="project-name-title">
      <div className="text-center">
        <h3 id="project-name-title" className="text-heading-3 font-semibold mb-2">
          What's your project called?
        </h3>
        <p className="text-body text-muted-foreground">
          Choose a clear, memorable name that reflects your product's purpose.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="project-name" className="text-body-small font-medium">
            Project Name *
          </Label>
          <div className="mt-2 space-y-2">
            <Input
              id="project-name"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={() => validateName(value)}
              placeholder="e.g., Smart Task Manager"
              className={`input-field ${error ? 'border-error' : ''}`}
              aria-describedby={error ? "name-error" : "name-help"}
              autoFocus
            />
            
            {error && (
              <Alert variant="destructive" id="name-error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <p id="name-help" className="text-xs text-muted-foreground">
              This will be the main identifier for your project across LiveDoc.
            </p>
          </div>
        </div>

        {/* Example Helper */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            <span className="text-body-small font-medium">Need inspiration?</span>
          </div>
          <p className="text-body-small text-muted-foreground">
            Try one of these example names to get started quickly:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_NAMES.map((name) => (
              <Button
                key={name}
                variant="outline"
                size="sm"
                onClick={() => onChange(name)}
                className="text-xs"
              >
                {name}
              </Button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={useExample} className="w-full">
            Use Random Example
          </Button>
        </div>

        {/* Guidelines */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Good project names:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Are clear and descriptive (e.g., "Recipe Sharing Hub")</li>
            <li>Hint at the core benefit (e.g., "Smart Task Manager")</li>
            <li>Are memorable and easy to say</li>
          </ul>
        </div>
      </div>
    </div>
  );
}