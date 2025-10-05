import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export default function JourneyMap() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [steps, setSteps] = useState<JourneyStep[]>([]);
  const [loading, setLoading] = useState(false);
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

    // Initialize with default 8 steps
    const defaultSteps: JourneyStep[] = [
      { id: "1", title: "Landing Page", description: "User arrives at the application", order: 1 },
      { id: "2", title: "Sign Up / Login", description: "User creates account or logs in", order: 2 },
      { id: "3", title: "Onboarding", description: "User completes initial setup", order: 3 },
      { id: "4", title: "Main Dashboard", description: "User views their dashboard", order: 4 },
      { id: "5", title: "Core Action", description: "User performs primary action", order: 5 },
      { id: "6", title: "Result View", description: "User sees results of their action", order: 6 },
      { id: "7", title: "Refinement", description: "User refines or adjusts", order: 7 },
      { id: "8", title: "Success State", description: "User achieves their goal", order: 8 },
    ];
    setSteps(defaultSteps);
  }, [projectId, navigate, toast]);

  const updateStep = (id: string, field: "title" | "description", value: string) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const addStep = () => {
    const newStep: JourneyStep = {
      id: Date.now().toString(),
      title: `Step ${steps.length + 1}`,
      description: "",
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    if (steps.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "Journey must have at least one step.",
        variant: "destructive"
      });
      return;
    }
    setSteps(prev => prev.filter(step => step.id !== id));
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      // Save journey map
      const { error } = await supabase
        .from("journey_maps")
        .upsert({
          project_id: projectId,
          steps: steps as any
        });

      if (error) throw error;

      // Get user if authenticated
      const { data: { user } } = await supabase.auth.getUser();

      // Log activity
      await supabase.from("activity_logs").insert({
        project_id: projectId,
        actor_id: user?.id || null,
        action: "journey_map_created",
        payload: { step_count: steps.length }
      });

      navigate("/project/summary", { state: { projectId } });
    } catch (error: any) {
      console.error("Error saving journey map:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save journey map",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-heading-1 font-bold mb-2 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-primary" />
            Journey Map
          </h1>
          <p className="text-body text-muted-foreground">
            Define the user journey through your product. Edit the steps below to match your workflow.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <Card key={step.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <Input
                    value={step.title}
                    onChange={(e) => updateStep(step.id, "title", e.target.value)}
                    placeholder="Step title"
                    className="font-semibold"
                  />
                  <Textarea
                    value={step.description}
                    onChange={(e) => updateStep(step.id, "description", e.target.value)}
                    placeholder="Describe what happens in this step..."
                    rows={2}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(step.id)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addStep}
          className="w-full mb-8"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={loading}
            className="button-primary"
          >
            Continue to Summary
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
