import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function PhaseSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const projectId = location.state?.projectId;

  useEffect(() => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project found. Please start from the beginning.",
        variant: "destructive"
      });
      navigate("/new");
      return;
    }

    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError) throw projectError;

      const { data: features, error: featuresError } = await supabase
        .from("features")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index");

      if (featuresError) throw featuresError;

      const { data: techReqs, error: techReqsError } = await supabase
        .from("technical_requirements")
        .select("*")
        .eq("project_id", projectId);

      if (techReqsError) throw techReqsError;

      const { data: journeyMap, error: journeyError } = await supabase
        .from("journey_maps")
        .select("*")
        .eq("project_id", projectId)
        .single();

      setProjectData({
        project,
        features: features || [],
        technicalRequirements: techReqs || [],
        journeyMap: journeyMap || null
      });
    } catch (error: any) {
      console.error("Error loading project data:", error);
      toast({
        title: "Error",
        description: "Failed to load project data",
        variant: "destructive"
      });
    }
  };

  const handleExportPRD = async () => {
    setLoading(true);
    try {
      const prdContent = {
        title: projectData.project.title,
        valueProposition: projectData.project.value_proposition,
        problemStatement: projectData.project.problem_statement,
        targetAudience: projectData.project.target_audience,
        features: projectData.features,
        technicalRequirements: projectData.technicalRequirements,
        journeyMap: projectData.journeyMap?.steps || [],
        generatedAt: new Date().toISOString()
      };

      // Save PRD document
      const { error } = await supabase
        .from("prd_documents")
        .insert({
          project_id: projectId,
          content: prdContent,
          version: 1
        });

      if (error) throw error;

      // Update project status
      await supabase
        .from("projects")
        .update({ status: "active" })
        .eq("id", projectId);

      // Get user if authenticated
      const { data: { user } } = await supabase.auth.getUser();

      // Log activity
      await supabase.from("activity_logs").insert({
        project_id: projectId,
        actor_id: user?.id || null,
        action: "prd_exported",
        payload: { format: "json" }
      });

      // Download as JSON
      const blob = new Blob([JSON.stringify(prdContent, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectData.project.title.replace(/\s+/g, "-")}-PRD.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "PRD document exported successfully!"
      });

      // Redirect to dashboard
      setTimeout(() => navigate("/"), 1500);
    } catch (error: any) {
      console.error("Error exporting PRD:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to export PRD",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!projectData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project summary...</p>
        </div>
      </div>
    );
  }

  const mvpFeatures = projectData.features.filter((f: any) => f.is_mvp);
  const mustHaveFeatures = projectData.features.filter((f: any) => f.priority === "must");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-heading-1 font-bold mb-2">Phase Complete!</h1>
          <p className="text-body text-muted-foreground">
            Your Strategic Foundation Document is ready
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Project Overview */}
          <Card className="p-6">
            <h2 className="text-heading-3 font-semibold mb-4">Project Overview</h2>
            <div className="space-y-3">
              <div>
                <p className="text-body-small text-muted-foreground">Project Name</p>
                <p className="text-body font-semibold">{projectData.project.title}</p>
              </div>
              <div>
                <p className="text-body-small text-muted-foreground">Value Proposition</p>
                <p className="text-body">{projectData.project.value_proposition}</p>
              </div>
              <div>
                <p className="text-body-small text-muted-foreground">Target Audience</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {projectData.project.target_audience?.map((audience: string) => (
                    <Badge key={audience} variant="secondary">{audience}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Features Summary */}
          <Card className="p-6">
            <h2 className="text-heading-3 font-semibold mb-4">Features Summary</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">{projectData.features.length}</p>
                <p className="text-body-small text-muted-foreground">Total Features</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">{mvpFeatures.length}</p>
                <p className="text-body-small text-muted-foreground">MVP Features</p>
              </div>
            </div>
            <div>
              <p className="text-body-small font-medium mb-2">Must-Have Features:</p>
              <ul className="space-y-1">
                {mustHaveFeatures.slice(0, 5).map((feature: any) => (
                  <li key={feature.id} className="text-body-small flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature.title}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Technical Requirements */}
          {projectData.technicalRequirements.length > 0 && (
            <Card className="p-6">
              <h2 className="text-heading-3 font-semibold mb-4">Technical Requirements</h2>
              <div className="flex flex-wrap gap-2">
                {projectData.technicalRequirements.map((req: any) => (
                  <Badge key={req.id} variant="outline">
                    {req.requirement_type}: {req.value}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Journey Map */}
          {projectData.journeyMap?.steps && (
            <Card className="p-6">
              <h2 className="text-heading-3 font-semibold mb-4">User Journey</h2>
              <p className="text-body-small text-muted-foreground mb-3">
                {projectData.journeyMap.steps.length} steps defined
              </p>
              <div className="space-y-2">
                {projectData.journeyMap.steps.slice(0, 3).map((step: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-body-small">{step.title}</p>
                  </div>
                ))}
                {projectData.journeyMap.steps.length > 3 && (
                  <p className="text-body-small text-muted-foreground pl-8">
                    +{projectData.journeyMap.steps.length - 3} more steps
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-3">
            <Button
              onClick={handleExportPRD}
              disabled={loading}
              className="button-primary"
            >
              {loading ? (
                <>Exporting...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export PRD
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
