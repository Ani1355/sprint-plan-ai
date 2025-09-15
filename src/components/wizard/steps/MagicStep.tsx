import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Lightbulb } from "lucide-react";

interface MagicStepProps {
  value: string;
  onChange: (value: string) => void;
}

const EXAMPLE_MAGIC = [
  "AI instantly transforms rough sketches into pixel-perfect designs with just one click, saving designers 3+ hours per project.",
  "Smart inventory sync prevents overselling by updating stock across all channels in real-time, even during high-traffic sales.",
  "One-click priority alignment gets entire teams on the same page instantly, eliminating weekly alignment meetings.",
  "Drag-and-drop asset organization that learns from your workflow, making file finding faster than thinking about it."
];

export function MagicStep({ value, onChange }: MagicStepProps) {
  const useExample = () => {
    const randomMagic = EXAMPLE_MAGIC[Math.floor(Math.random() * EXAMPLE_MAGIC.length)];
    onChange(randomMagic);
  };

  const characterCount = value.length;
  const isOptimalLength = characterCount >= 80 && characterCount <= 250;

  return (
    <div className="space-y-6" role="region" aria-labelledby="magic-title">
      <div className="text-center">
        <h3 id="magic-title" className="text-heading-3 font-semibold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          What makes it magical?
        </h3>
        <p className="text-body text-muted-foreground">
          Describe your unique solution and the "wow" moment users will experience.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="magic-input" className="text-body-small font-medium">
            Magic Moment *
          </Label>
          <div className="mt-2 space-y-2">
            <Textarea
              id="magic-input"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Describe what makes your solution uniquely powerful..."
              className="input-field min-h-[120px] resize-none"
              autoFocus
            />
            
            <div className="flex justify-between text-xs">
              <span className={`${isOptimalLength ? 'text-success' : 'text-muted-foreground'}`}>
                {characterCount} characters {isOptimalLength && '(good length)'}
              </span>
              <span className="text-muted-foreground">
                Aim for 80-250 characters
              </span>
            </div>
          </div>
        </div>

        {/* Example Helper */}
        <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg p-4 space-y-3 border border-accent/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-body-small font-medium">Magic moment examples</span>
          </div>
          <div className="space-y-2">
            {EXAMPLE_MAGIC.slice(0, 2).map((magic, index) => (
              <div key={index} className="text-body-small text-muted-foreground italic bg-background/70 p-3 rounded border-l-2 border-accent/50">
                "{magic}"
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={useExample} className="w-full">
            Use Random Example
          </Button>
        </div>

        {/* Guidelines */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs space-y-2">
              <p className="font-medium text-foreground">What makes a moment "magical":</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Delivers instant results (specific time saved or gained)</li>
                <li>Eliminates a tedious manual process completely</li>
                <li>Uses AI, automation, or smart technology in a surprising way</li>
                <li>Creates an "I can't believe it was that easy" feeling</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Magic Framework */}
        <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
          <p className="font-medium mb-1">Try this framework:</p>
          <p className="italic">"[Technology/Feature] + [instant action] + [specific benefit/time saved]"</p>
        </div>
      </div>
    </div>
  );
}