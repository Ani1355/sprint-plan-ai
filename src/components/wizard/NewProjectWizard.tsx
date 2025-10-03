import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ProjectNameStep } from "./steps/ProjectNameStep";
import { TargetAudienceStep } from "./steps/TargetAudienceStep";
import { ProblemStep } from "./steps/ProblemStep";
import { MagicStep } from "./steps/MagicStep";
import { OptionalDetailsStep } from "./steps/OptionalDetailsStep";
import { AIGenerationModal } from "./AIGenerationModal";
import { AutosaveToast } from "./AutosaveToast";
import { useToast } from "@/hooks/use-toast";

export interface ProjectData {
  projectName: string;
  targetAudience: string[];
  problem: string;
  magic: string;
  platforms?: string[];
  competitors?: string;
}

interface NewProjectWizardProps {
  open: boolean;
  onClose: () => void;
}

const TOTAL_STEPS = 5;
const STEP_TITLES = [
  "Project Name",
  "Target Audience", 
  "Problem Statement",
  "Magic Moment",
  "Optional Details"
];

export function NewProjectWizard({ open, onClose }: NewProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: "",
    targetAudience: [],
    problem: "",
    magic: "",
    platforms: [],
    competitors: ""
  });
  const [showAIGeneration, setShowAIGeneration] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"saving" | "saved" | "error" | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const progress = (currentStep / TOTAL_STEPS) * 100;

  // Autosave functionality with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (projectData.projectName) {
        setAutosaveStatus("saving");
        // Simulate autosave
        setTimeout(() => {
          setAutosaveStatus("saved");
          setLastSaved(new Date());
        }, 500);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [projectData]);

  const updateProjectData = (field: keyof ProjectData, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return projectData.projectName.trim() !== "";
      case 2: return projectData.targetAudience.length > 0;
      case 3: return projectData.problem.trim() !== "";
      case 4: return projectData.magic.trim() !== "";
      case 5: return true; // Optional step
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGenerate = () => {
    if (!canProceed()) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields before generating.",
        variant: "destructive"
      });
      return;
    }
    setShowAIGeneration(true);
  };

  const handleAIComplete = (visionData: any) => {
    setShowAIGeneration(false);
    navigate("/project/vision", { state: { projectData, visionData } });
  };

  const handleClose = () => {
    // Save as draft
    if (projectData.projectName) {
      toast({
        title: "Draft Saved",
        description: "Your project has been saved as a draft and will appear on your dashboard."
      });
    }
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProjectNameStep value={projectData.projectName} onChange={(value) => updateProjectData("projectName", value)} />;
      case 2:
        return <TargetAudienceStep value={projectData.targetAudience} onChange={(value) => updateProjectData("targetAudience", value)} />;
      case 3:
        return <ProblemStep value={projectData.problem} onChange={(value) => updateProjectData("problem", value)} />;
      case 4:
        return <MagicStep value={projectData.magic} onChange={(value) => updateProjectData("magic", value)} />;
      case 5:
        return <OptionalDetailsStep 
          data={{
            platforms: projectData.platforms,
            competitors: projectData.competitors
          }}
          onChange={updateProjectData}
        />;
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                <span className="truncate">Create New Project</span>
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleClose} className="min-h-[44px] min-w-[44px]" aria-label="Close dialog">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="px-4 sm:px-6">
            {/* Progress Rail */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-2">
                <span>Step {currentStep} of {TOTAL_STEPS}</span>
                <span className="hidden sm:inline">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="mb-2" />
              <p className="text-sm sm:text-base font-medium">{STEP_TITLES[currentStep - 1]}</p>
            </div>

            {/* Step Content */}
            <div className="mb-6 sm:mb-8 min-h-[250px] sm:min-h-[300px]">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pb-4 sm:pb-6 gap-3">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>

              <div className="flex gap-2">
                {currentStep === TOTAL_STEPS ? (
                  <Button 
                    onClick={handleGenerate}
                    disabled={!canProceed()}
                    className="button-primary flex items-center gap-2 min-h-[44px]"
                  >
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Generate Vision</span>
                    <span className="sm:hidden">Generate</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="button-primary flex items-center gap-2 min-h-[44px]"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AIGenerationModal 
        open={showAIGeneration}
        projectData={projectData}
        onComplete={handleAIComplete}
        onClose={() => setShowAIGeneration(false)}
      />

      <AutosaveToast 
        status={autosaveStatus}
        lastSaved={lastSaved}
        onStatusChange={setAutosaveStatus}
      />
    </>
  );
}