import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Settings, Lightbulb, X } from "lucide-react";

interface OptionalDetailsData {
  platforms?: string[];
  competitors?: string;
}

interface OptionalDetailsStepProps {
  data: OptionalDetailsData;
  onChange: (field: keyof OptionalDetailsData, value: any) => void;
}

const PLATFORM_OPTIONS = [
  "Web App",
  "Mobile iOS",
  "Mobile Android", 
  "Desktop",
  "Chrome Extension",
  "API/SDK"
];


export function OptionalDetailsStep({ data, onChange }: OptionalDetailsStepProps) {
  const togglePlatform = (platform: string) => {
    const current = data.platforms || [];
    const updated = current.includes(platform) 
      ? current.filter(p => p !== platform)
      : [...current, platform];
    onChange("platforms", updated);
  };

  const fillExampleData = () => {
    onChange("platforms", ["Web App", "Mobile iOS"]);
    onChange("competitors", "Figma, Canva, Adobe XD");
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="optional-title">
      <div className="text-center">
        <h3 id="optional-title" className="text-heading-3 font-semibold mb-2 flex items-center justify-center gap-2">
          <Settings className="w-6 h-6 text-muted-foreground" />
          Optional Details
        </h3>
        <p className="text-body text-muted-foreground">
          These details help us tailor better recommendations. All fields are optional.
        </p>
      </div>

      <div className="space-y-6">
        {/* Target Platforms */}
        <div>
          <Label className="text-body-small font-medium">Target Platforms</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Where will users access your product?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORM_OPTIONS.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={platform}
                  checked={(data.platforms || []).includes(platform)}
                  onCheckedChange={() => togglePlatform(platform)}
                />
                <Label 
                  htmlFor={platform} 
                  className="text-body-small cursor-pointer"
                >
                  {platform}
                </Label>
              </div>
            ))}
          </div>
          {data.platforms && data.platforms.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {data.platforms.map((platform) => (
                <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                  {platform}
                  <button
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className="hover:bg-muted rounded-full p-0.5"
                    aria-label={`Remove ${platform}`}
                  >
                    <X className="w-2 h-2" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Competitors */}
        <div>
          <Label htmlFor="competitors" className="text-body-small font-medium">
            Similar Products / Competitors
          </Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">
            What existing solutions are similar? (helps us understand positioning)
          </p>
          <Textarea
            id="competitors"
            value={data.competitors || ""}
            onChange={(e) => onChange("competitors", e.target.value)}
            placeholder="e.g., Figma, Canva, Adobe XD"
            className="input-field resize-none"
            rows={2}
          />
        </div>


        {/* Example Helper */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            <span className="text-body-small font-medium">Quick fill example data</span>
          </div>
          <p className="text-body-small text-muted-foreground">
            Not sure what to pick? Fill in some common startup choices:
          </p>
          <Button variant="ghost" size="sm" onClick={fillExampleData} className="w-full">
            Use Example Details
          </Button>
        </div>

        {/* Skip Info */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💡 You can always add or update these details later in your project settings.
          </p>
        </div>
      </div>
    </div>
  );
}