import { useState, useRef, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Users } from "lucide-react";

interface TargetAudienceStepProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const SUGGESTED_AUDIENCES = [
  "Freelance designers",
  "Small business owners", 
  "Remote teams",
  "Content creators",
  "Students",
  "Busy professionals",
  "Startup founders",
  "Marketing teams",
  "Software developers",
  "E-commerce sellers"
];

export function TargetAudienceStep({ value, onChange }: TargetAudienceStepProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = SUGGESTED_AUDIENCES.filter(
    audience => 
      audience.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(audience)
  );

  const addAudience = (audience: string) => {
    if (audience.trim() && !value.includes(audience.trim())) {
      onChange([...value, audience.trim()]);
      setInputValue("");
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const removeAudience = (audienceToRemove: string) => {
    onChange(value.filter(audience => audience !== audienceToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addAudience(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeAudience(value[value.length - 1]);
    }
  };

  const useExample = () => {
    const exampleAudiences = ["Freelance designers", "Small business owners"];
    onChange(exampleAudiences);
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="audience-title">
      <div className="text-center">
        <h3 id="audience-title" className="text-heading-3 font-semibold mb-2">
          Who's it for?
        </h3>
        <p className="text-body text-muted-foreground">
          Define your target audience to shape the product direction.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="audience-input" className="text-body-small font-medium">
            Target Audience *
          </Label>
          <div className="mt-2 space-y-3">
            {/* Selected Tags */}
            {value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {value.map((audience) => (
                  <Badge key={audience} variant="secondary" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {audience}
                    <button
                      type="button"
                      onClick={() => removeAudience(audience)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                      aria-label={`Remove ${audience}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="relative">
              <Input
                id="audience-input"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(inputValue.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Type and press Enter to add audience..."
                className="input-field"
                autoComplete="off"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addAudience(inputValue)}
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="border border-border rounded-md bg-card shadow-lg max-h-40 overflow-y-auto">
                {filteredSuggestions.slice(0, 5).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addAudience(suggestion)}
                    className="w-full px-3 py-2 text-left text-body-small hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Add Suggestions */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-body-small font-medium">Popular audiences</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_AUDIENCES.slice(0, 6).map((audience) => (
              <Button
                key={audience}
                variant="outline"
                size="sm"
                onClick={() => addAudience(audience)}
                disabled={value.includes(audience)}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                {audience}
              </Button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={useExample} className="w-full">
            Use Example Audiences
          </Button>
        </div>

        {/* Guidelines */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Tip:</p>
          <p>Be specific about your audience. Instead of "everyone," try "busy professionals who work remotely" or "freelance graphic designers."</p>
        </div>
      </div>
    </div>
  );
}