import { Plus, Sparkles, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-brand rounded-3xl flex items-center justify-center mb-4 mx-auto">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center animate-pulse">
          <FileText className="w-4 h-4 text-accent" />
        </div>
        <div className="absolute -bottom-1 -left-2 w-6 h-6 bg-success/20 rounded-full flex items-center justify-center animate-pulse delay-300">
          <Zap className="w-3 h-3 text-success" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md space-y-4">
        <h2 className="text-heading-1 text-card-foreground">
          Create Your First Project
        </h2>
        <p className="text-body text-text-secondary">
          Transform your product ideas into actionable PRDs with AI-powered assistance. 
          Get started in minutes with intelligent templates and collaborative tools.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
        <Button className="button-primary flex items-center gap-2" size="lg">
          <Plus className="w-5 h-5" />
          Start New Project
        </Button>
        <Button variant="outline" size="lg" className="button-secondary">
          Browse Templates
        </Button>
      </div>

      {/* Helper Steps */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <div className="flex items-start gap-3 p-4 bg-gradient-subtle rounded-2xl">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-body-small font-bold text-primary">1</span>
          </div>
          <div>
            <h4 className="text-body font-semibold text-card-foreground mb-1">
              Describe Your Idea
            </h4>
            <p className="text-body-small text-text-secondary">
              Tell us about your product vision in plain language
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-gradient-subtle rounded-2xl">
          <div className="w-8 h-8 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-body-small font-bold text-accent">2</span>
          </div>
          <div>
            <h4 className="text-body font-semibold text-card-foreground mb-1">
              AI Builds Your PRD
            </h4>
            <p className="text-body-small text-text-secondary">
              Get a complete document with features, specs, and timelines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}