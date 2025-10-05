import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { ProjectData } from "./NewProjectWizard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    setCurrentStage(0);
    setProgress(0);
    setError(null);
    setIsRetrying(false);

    const runGeneration = async () => {
      try {
        // Start progress animation
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(prev + 1, 95);
            return newProgress;
          });
        }, 100);

        // Animate through stages
        for (let i = 0; i < GENERATION_STAGES.length; i++) {
          setCurrentStage(i);
          await new Promise(resolve => setTimeout(resolve, GENERATION_STAGES[i].duration / 2));
        }

        // Call the AI edge function
        const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-prd', {
          body: { projectData }
        });

        clearInterval(progressInterval);

        if (functionError) {
          console.error('Edge function error:', functionError);
          throw new Error(functionError.message || 'Failed to generate PRD');
        }

        if (!functionData) {
          throw new Error('No data returned from AI generation');
        }

        // Complete progress
        setProgress(100);

        // Show completion briefly before transitioning
        await new Promise(resolve => setTimeout(resolve, 500));

        // Save project to database
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            toast({
              title: "Authentication Required",
              description: "Please sign in to save your project.",
              variant: "destructive"
            });
            navigate("/");
            return;
          }

          // Create project
          const { data: project, error: projectError } = await supabase
            .from("projects")
            .insert({
              owner_id: user.id,
              title: projectData.projectName,
              target_audience: projectData.targetAudience,
              problem_statement: projectData.problem,
              magic_moment: projectData.magic,
              platforms: projectData.platforms,
              competitors: projectData.competitors,
              value_proposition: functionData.valueProposition,
              primary_user_action: functionData.primaryUserAction,
              status: "draft"
            })
            .select()
            .single();

          if (projectError) throw projectError;

          // Save features
          if (functionData.features && functionData.features.length > 0) {
            const featuresData = functionData.features.map((feature: any, index: number) => ({
              project_id: project.id,
              title: feature.title,
              description: feature.description,
              priority: feature.priority || "could",
              effort: feature.effort,
              value_score: feature.valueScore,
              is_mvp: index < 7,
              order_index: index
            }));

            const { error: featuresError } = await supabase
              .from("features")
              .insert(featuresData);

            if (featuresError) throw featuresError;
          }

          // Log activity
          await supabase.from("activity_logs").insert({
            project_id: project.id,
            actor_id: user.id,
            action: "project_created",
            payload: { source: "wizard" }
          });

          onComplete({ ...functionData, projectId: project.id });
        } catch (dbError: any) {
          console.error("Error saving project:", dbError);
          toast({
            title: "Error",
            description: dbError.message || "Failed to save project",
            variant: "destructive"
          });
          setError("Failed to save project. Please try again.");
        }

      } catch (err) {
        console.error('AI generation error:', err);
        setError(
          err instanceof Error && err.message.includes('Rate limit') 
            ? "Rate limit exceeded. Please try again in a moment."
            : err instanceof Error && err.message.includes('credits')
              ? "AI credits exhausted. Please contact support."
              : "AI generation failed. Please try again or continue manually."
        );
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
        <DialogTitle className="sr-only">AI Generation Progress</DialogTitle>
        <DialogDescription className="sr-only">
          Generating your product vision and features using AI
        </DialogDescription>
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