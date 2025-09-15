import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { ProjectData } from "./NewProjectWizard";

interface AIGenerationModalProps {
  open: boolean;
  projectData: ProjectData;
  onComplete: (visionData: any) => void;
  onClose: () => void;
}

const GENERATION_STAGES = [
  { label: "Analyzing your inputs...", duration: 2000 },
  { label: "Generating product vision...", duration: 3000 },
  { label: "Creating feature suggestions...", duration: 2500 },
  { label: "Finalizing strategic foundation...", duration: 1500 }
];

export function AIGenerationModal({ open, projectData, onComplete, onClose }: AIGenerationModalProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!open) return;

    setCurrentStage(0);
    setProgress(0);
    setError(null);
    setIsRetrying(false);

    const runGeneration = async () => {
      try {
        for (let i = 0; i < GENERATION_STAGES.length; i++) {
          setCurrentStage(i);
          
          // Smooth progress animation
          const stageProgress = ((i + 1) / GENERATION_STAGES.length) * 100;
          const startProgress = (i / GENERATION_STAGES.length) * 100;
          
          const progressInterval = setInterval(() => {
            setProgress(prev => {
              const newProgress = Math.min(prev + 2, stageProgress);
              if (newProgress >= stageProgress) {
                clearInterval(progressInterval);
              }
              return newProgress;
            });
          }, 50);

          // Wait for stage duration
          await new Promise(resolve => setTimeout(resolve, GENERATION_STAGES[i].duration));
          clearInterval(progressInterval);
          setProgress(stageProgress);
        }

        // Simulate AI generation result
        const mockVisionData = {
          valueProposition: `${projectData.projectName} empowers ${projectData.targetAudience.join(" and ")} to overcome ${projectData.problem.slice(0, 50)}... through ${projectData.magic.slice(0, 50)}...`,
          confidence: Math.random() > 0.3 ? "high" : Math.random() > 0.1 ? "medium" : "low",
          features: [
            "User authentication and onboarding",
            "Core workflow automation",
            "Real-time collaboration tools",
            "Analytics dashboard",
            "Mobile responsive design"
          ],
          aiGenerated: true,
          timestamp: new Date().toISOString()
        };

        setTimeout(() => {
          onComplete(mockVisionData);
        }, 500);

      } catch (err) {
        setError("AI generation failed. This might be due to high demand or a temporary issue.");
      }
    };

    runGeneration();
  }, [open, projectData, onComplete]);

  const handleRetry = () => {
    setIsRetrying(true);
    setError(null);
    
    // Reset and restart generation
    setTimeout(() => {
      setCurrentStage(0);
      setProgress(0);
      setIsRetrying(false);
      // Trigger generation restart by toggling state
    }, 1000);
  };

  const handleFallback = () => {
    // Navigate to manual input mode
    onComplete({
      valueProposition: "",
      confidence: "manual",
      features: [],
      aiGenerated: false,
      fallbackUsed: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-6 py-6">
          {error ? (
            // Error State
            <>
              <div className="mx-auto w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-error" />
              </div>
              <div className="space-y-2">
                <h3 className="text-heading-3 font-semibold">Generation Failed</h3>
                <p className="text-body-small text-muted-foreground">
                  {error}
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={handleRetry} 
                  disabled={isRetrying}
                  className="w-full"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleFallback} className="w-full">
                  Continue Manually
                </Button>
                <Button variant="ghost" onClick={onClose} className="w-full">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            // Generation In Progress
            <>
              <div className="mx-auto w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-heading-3 font-semibold">Generating Your Product Vision</h3>
                  <p className="text-body text-muted-foreground">
                    {GENERATION_STAGES[currentStage]?.label}
                  </p>
                </div>

                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-body-small text-muted-foreground">
                    {Math.round(progress)}% Complete
                  </p>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>✨ Analyzing: {projectData.projectName}</p>
                  <p>👥 For: {projectData.targetAudience.join(", ")}</p>
                  <p>🎯 Solving: {projectData.problem.slice(0, 40)}...</p>
                </div>
              </div>

              <Button variant="ghost" onClick={onClose} className="mt-4">
                Cancel Generation
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}