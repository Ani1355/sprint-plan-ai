import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface ProblemStepProps {
  value: string;
  onChange: (value: string) => void;
}

const EXAMPLE_PROBLEMS = [
  "Freelance designers waste hours on client revision cycles, losing money and sanity with endless back-and-forth emails.",
  "Small businesses struggle to manage inventory across multiple sales channels, leading to overselling and customer disappointment.",
  "Remote teams can't stay aligned on project priorities, causing missed deadlines and frustrated stakeholders.",
  "Content creators spend more time organizing assets than actually creating, killing their creative momentum."
];

export function ProblemStep({ value, onChange }: ProblemStepProps) {
  const useExample = () => {
    const randomProblem = EXAMPLE_PROBLEMS[Math.floor(Math.random() * EXAMPLE_PROBLEMS.length)];
    onChange(randomProblem);
  };

  const characterCount = value.length;
  const isOptimalLength = characterCount >= 100 && characterCount <= 300;

  return (
    <div className="space-y-6" role="region" aria-labelledby="problem-title">
      <div className="text-center">
        <h3 id="problem-title" className="text-heading-3 font-semibold mb-2">
          What problem does it solve?
        </h3>
        <p className="text-body text-muted-foreground">
          Describe the pain point your product addresses. Be specific about the impact.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="problem-input" className="text-body-small font-medium">
            Problem Statement *
          </Label>
          <div className="mt-2 space-y-2">
            <Textarea
              id="problem-input"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Describe the specific problem your target audience faces..."
              className="input-field min-h-[120px] resize-none"
              autoFocus
            />
            
            <div className="flex justify-between text-xs">
              <span className={`${isOptimalLength ? 'text-success' : 'text-muted-foreground'}`}>
                {characterCount} characters {isOptimalLength && '(good length)'}
              </span>
              <span className="text-muted-foreground">
                Aim for 100-300 characters for best results
              </span>
            </div>
          </div>
        </div>

        {/* Example Helper */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            <span className="text-body-small font-medium">Example problems</span>
          </div>
          <div className="space-y-2">
            {EXAMPLE_PROBLEMS.slice(0, 2).map((problem, index) => (
              <div key={index} className="text-body-small text-muted-foreground italic bg-background/50 p-3 rounded border-l-2 border-accent/30">
                "{problem}"
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={useExample} className="w-full">
            Use Random Example
          </Button>
        </div>

        {/* Guidelines */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs space-y-2">
              <p className="font-medium text-amber-800">Strong problem statements:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-700">
                <li>Focus on a specific pain point, not general inconvenience</li>
                <li>Mention the impact (time lost, money wasted, frustration)</li>
                <li>Connect to your target audience's daily experience</li>
                <li>Avoid solution language—describe the problem, not your fix</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}