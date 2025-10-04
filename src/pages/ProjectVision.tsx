import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
 
import { 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  History,
  Flag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProjectVision() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { projectData, visionData, projectId } = location.state || {};

  // Ensure hooks are always called; redirect via effect to satisfy hooks rules
  useEffect(() => {
    if (!projectData || !visionData) {
      navigate("/", { replace: true });
    }
  }, [projectData, visionData, navigate]);

  const [currentVision, setCurrentVision] = useState(visionData.valueProposition);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editHistory, setEditHistory] = useState([visionData.valueProposition]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high": return "text-success";
      case "medium": return "text-warning";
      case "low": return "text-error";
      default: return "text-muted-foreground";
    }
  };

  const getConfidenceDescription = (confidence: string) => {
    switch (confidence) {
      case "high": return "AI is confident this vision aligns well with your inputs";
      case "medium": return "AI generated this with moderate confidence - consider reviewing";
      case "low": return "AI had difficulty generating - manual editing recommended";
      default: return "This vision was created manually";
    }
  };

  const handleTextChange = (newText: string) => {
    setCurrentVision(newText);
    setHasUnsavedChanges(newText !== visionData.valueProposition);
  };

  const handleSave = () => {
    // Add to edit history if different
    if (!editHistory.includes(currentVision)) {
      setEditHistory(prev => [...prev, currentVision]);
    }
    setHasUnsavedChanges(false);
    
    toast({
      title: "Vision Saved",
      description: "Your product vision has been updated successfully."
    });
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const problemCore = projectData.problem.split('.')[0];
    const magicCore = projectData.magic.split('.')[0];
    const regenerated = `${projectData.projectName} empowers ${projectData.targetAudience.join(", ")} by solving ${problemCore} with ${magicCore}.`;
    setCurrentVision(regenerated);
    setHasUnsavedChanges(true);
    setIsRegenerating(false);
    toast({
      title: "Vision Regenerated",
      description: "A fresh vision statement has been generated. Review and save if you like."
    });
  };

  const revertToVersion = (version: string) => {
    setCurrentVision(version);
    setHasUnsavedChanges(version !== visionData.valueProposition);
  };

  const flagContent = () => {
    toast({
      title: "Content Flagged",
      description: "Thank you for your feedback. Our team will review this content.",
      variant: "destructive"
    });
  };

  const handleProceed = () => {
    if (hasUnsavedChanges) {
      handleSave();
    }
    // Navigate to next step (Feature Generation)
    navigate("/project/features", { 
      state: { 
        projectData, 
        visionData: { ...visionData, valueProposition: currentVision },
        projectId
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="min-h-[44px] shrink-0">
                  <ArrowLeft className="w-4 h-4 sm:mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </Button>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Your Product Vision</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                    Review and refine the AI-generated vision for {projectData.projectName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className={`flex items-center gap-1 text-xs ${getConfidenceColor(visionData.confidence)}`}>
                      {visionData.confidence === "high" && <CheckCircle className="w-3 h-3" aria-hidden="true" />}
                      {visionData.confidence === "medium" && <Info className="w-3 h-3" aria-hidden="true" />}
                      {visionData.confidence === "low" && <AlertTriangle className="w-3 h-3" aria-hidden="true" />}
                      <span className="hidden sm:inline">{visionData.confidence} confidence</span>
                      <span className="sm:hidden">{visionData.confidence}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{getConfidenceDescription(visionData.confidence)}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-base sm:text-lg">Product Vision Statement</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isRegenerating} className="min-h-[44px]">
                        <RefreshCw className={`w-4 h-4 sm:mr-2 ${isRegenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
                        <span className="hidden sm:inline">Regenerate</span>
                      </Button>
                      <Button onClick={handleSave} disabled={!hasUnsavedChanges} size="sm" className="min-h-[44px]">
                        <Save className="w-4 h-4 sm:mr-2" aria-hidden="true" />
                        <span className="hidden sm:inline">Save</span>
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={currentVision}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="min-h-[200px] text-body resize-none"
                    placeholder="Your product vision will appear here..."
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{currentVision.length} characters</span>
                    {hasUnsavedChanges && <span className="text-warning">Unsaved changes</span>}
                  </div>

                  {/* Inline Suggestions */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleTextChange(currentVision.replace(/\.$/, '. This solution saves users significant time and reduces frustration.'))}>
                      + Add Impact
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTextChange(currentVision.length > 100 ? currentVision.slice(0, 100) + '...' : currentVision)}>
                      ✂ Shorten
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTextChange(currentVision.replace(/helps|assists/gi, 'empowers'))}>
                      🔥 Stronger Tone
                    </Button>
                  </div>

                  {visionData.confidence === "low" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="font-medium text-amber-800">Low Confidence Result</p>
                          <p className="text-amber-700">
                            The AI wasn't confident about this vision. Consider editing manually or providing more specific inputs.
                          </p>
                          <Button variant="ghost" size="sm" onClick={flagContent} className="text-amber-800 p-0 h-auto">
                            <Flag className="w-3 h-3 mr-1" />
                            Flag if inappropriate
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Edit History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-body">
                    <History className="w-4 h-4" />
                    Edit History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {editHistory.slice().reverse().map((version, index) => (
                      <div key={index} className="text-xs p-2 bg-muted/30 rounded border cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => revertToVersion(version)}>
                        <p className="truncate">{version.slice(0, 60)}...</p>
                        <span className="text-muted-foreground">Version {editHistory.length - index}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-body">Project Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Target Audience:</p>
                    <p>{projectData.targetAudience.join(", ")}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Problem:</p>
                    <p className="line-clamp-3">{projectData.problem}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Magic Moment:</p>
                    <p className="line-clamp-3">{projectData.magic}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardContent className="pt-6">
                  <Button onClick={handleProceed} className="w-full">
                    Continue to Features
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Next: Generate and prioritize features for your product
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}