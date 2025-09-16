import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ChevronRight,
  Shield,
  Zap,
  Settings,
  Clock,
  AlertTriangle,
  Check,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TechnicalRequirement {
  type: 'auth' | 'integration' | 'performance';
  id: string;
  label: string;
  description: string;
  selected: boolean;
  metadata?: {
    scopes?: string[];
    timeImpact?: string;
    complexity?: 'Low' | 'Medium' | 'High';
  };
}

interface ArchitecturePreview {
  title: string;
  description: string;
  techStack: string[];
  estimatedTime: string;
  recommendations: string[];
}

export default function TechnicalNeeds() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { projectData, visionData, features } = location.state || {};
  
  if (!projectData || !visionData || !features) {
    return <Navigate to="/" replace />;
  }

  const [requirements, setRequirements] = useState<TechnicalRequirement[]>([
    // Authentication
    {
      type: 'auth',
      id: 'email-password',
      label: 'Email + Password',
      description: 'Traditional email/password authentication',
      selected: false,
      metadata: { complexity: 'Low', timeImpact: '+1 day' }
    },
    {
      type: 'auth',
      id: 'oauth-google',
      label: 'Google OAuth',
      description: 'Sign in with Google accounts',
      selected: false,
      metadata: { 
        scopes: ['profile', 'email'], 
        complexity: 'Medium',
        timeImpact: '+2 days'
      }
    },
    {
      type: 'auth',
      id: 'oauth-github',
      label: 'GitHub OAuth',
      description: 'Sign in with GitHub accounts',
      selected: false,
      metadata: { 
        scopes: ['user:email', 'read:user'], 
        complexity: 'Medium',
        timeImpact: '+2 days'
      }
    },
    {
      type: 'auth',
      id: 'sso',
      label: 'Enterprise SSO',
      description: 'SAML/OIDC for enterprise customers',
      selected: false,
      metadata: { complexity: 'High', timeImpact: '+5 days' }
    },
    
    // Integrations
    {
      type: 'integration',
      id: 'stripe',
      label: 'Stripe Payments',
      description: 'Payment processing and subscriptions',
      selected: false,
      metadata: { 
        scopes: ['payment_intents', 'customers', 'subscriptions'],
        complexity: 'Medium',
        timeImpact: '+3 days'
      }
    },
    {
      type: 'integration',
      id: 'figma',
      label: 'Figma Integration',
      description: 'Access and sync Figma designs',
      selected: false,
      metadata: { 
        scopes: ['files:read', 'files:write'],
        complexity: 'High',
        timeImpact: '+4 days'
      }
    },
    {
      type: 'integration',
      id: 'supabase-storage',
      label: 'File Storage',
      description: 'Supabase storage for file uploads',
      selected: true,
      metadata: { complexity: 'Low', timeImpact: '+1 day' }
    },
    {
      type: 'integration',
      id: 'email-service',
      label: 'Email Service',
      description: 'Transactional emails and notifications',
      selected: false,
      metadata: { complexity: 'Low', timeImpact: '+1 day' }
    }
  ]);

  const [performancePriority, setPerformancePriority] = useState<string>('balanced');
  const [architecturePreview, setArchitecturePreview] = useState<ArchitecturePreview | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Generate architecture preview when selections change
  useEffect(() => {
    const generatePreview = () => {
      setIsGeneratingPreview(true);
      
      setTimeout(() => {
        const selectedReqs = requirements.filter(r => r.selected);
        const authMethods = selectedReqs.filter(r => r.type === 'auth');
        const integrations = selectedReqs.filter(r => r.type === 'integration');
        
        const totalTimeImpact = selectedReqs.reduce((total, req) => {
          const timeStr = req.metadata?.timeImpact || '+0 days';
          const days = parseInt(timeStr.match(/\d+/)?.[0] || '0');
          return total + days;
        }, 0);

        const techStack = [
          'React + TypeScript',
          'Tailwind CSS',
          'Supabase (Database + Auth)',
          ...authMethods.map(auth => `${auth.label} Auth`),
          ...integrations.map(int => `${int.label} API`),
          performancePriority === 'high' ? 'CDN + Caching' : '',
          performancePriority === 'high' ? 'Server-side Rendering' : ''
        ].filter(Boolean);

        const recommendations = [
          totalTimeImpact > 10 ? 'Consider phasing integrations to reduce initial scope' : '',
          authMethods.length > 2 ? 'Multiple auth methods may complicate user experience' : '',
          integrations.some(i => i.id === 'stripe') && integrations.some(i => i.id === 'figma') ? 'Payment + Design integration requires careful UX planning' : '',
          performancePriority === 'high' ? 'High performance setup will increase infrastructure complexity' : ''
        ].filter(Boolean);

        setArchitecturePreview({
          title: `${projectData.projectName} Architecture`,
          description: `Full-stack web application with ${authMethods.length} auth method(s) and ${integrations.length} integration(s)`,
          techStack,
          estimatedTime: `${totalTimeImpact + 7} days development`,
          recommendations: recommendations.length > 0 ? recommendations : ['Architecture looks well-balanced for MVP development']
        });
        
        setIsGeneratingPreview(false);
      }, 800);
    };

    generatePreview();
  }, [requirements, performancePriority, projectData.projectName]);

  const toggleRequirement = (id: string) => {
    setRequirements(prev => prev.map(req => 
      req.id === id ? { ...req, selected: !req.selected } : req
    ));
  };

  const getRequirementsByType = (type: string) => {
    return requirements.filter(req => req.type === type);
  };

  const handleProceed = () => {
    const selectedRequirements = requirements.filter(r => r.selected);
    
    // Auto-save technical needs
    localStorage.setItem('technicalNeeds', JSON.stringify({
      requirements: selectedRequirements,
      performancePriority,
      architecturePreview
    }));
    
    navigate("/project/journey-map", { 
      state: { 
        projectData, 
        visionData,
        features,
        technicalNeeds: {
          requirements: selectedRequirements,
          performancePriority,
          architecturePreview
        }
      }
    });
  };

  const selectedCount = requirements.filter(r => r.selected).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Accessibility announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="architecture-updates"
      >
        {isGeneratingPreview ? 'Updating architecture preview' : 'Architecture preview updated'}
      </div>

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-heading-2 font-bold">Technical Requirements</h1>
                <p className="text-body-small text-muted-foreground">
                  Define authentication, integrations, and performance needs for {projectData.projectName}
                </p>
              </div>
            </div>
            
            <Badge variant="secondary" className="flex items-center gap-1">
              <Settings className="w-3 h-3" />
              {selectedCount} Selected
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Requirements Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="auth" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="auth" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Authentication
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Performance
                </TabsTrigger>
              </TabsList>

              {/* Authentication Tab */}
              <TabsContent value="auth" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-body">Authentication Methods</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {getRequirementsByType('auth').map(req => (
                      <div key={req.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={req.id}
                          checked={req.selected}
                          onCheckedChange={() => toggleRequirement(req.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={req.id} className="font-medium cursor-pointer">
                              {req.label}
                            </Label>
                            <Badge variant="outline" className="text-xs">
                              {req.metadata?.complexity} complexity
                            </Badge>
                            {req.metadata?.timeImpact && (
                              <Badge variant="secondary" className="text-xs">
                                {req.metadata.timeImpact}
                              </Badge>
                            )}
                          </div>
                          <p className="text-body-small text-muted-foreground">
                            {req.description}
                          </p>
                          {req.metadata?.scopes && req.selected && (
                            <div className="pt-2">
                              <p className="text-xs text-muted-foreground mb-1">Required scopes:</p>
                              <div className="flex gap-1 flex-wrap">
                                {req.metadata.scopes.map(scope => (
                                  <Badge key={scope} variant="outline" className="text-xs">
                                    {scope}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-body">Third-party Integrations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {getRequirementsByType('integration').map(req => (
                      <div key={req.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={req.id}
                          checked={req.selected}
                          onCheckedChange={() => toggleRequirement(req.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={req.id} className="font-medium cursor-pointer">
                              {req.label}
                            </Label>
                            <Badge variant="outline" className="text-xs">
                              {req.metadata?.complexity} complexity
                            </Badge>
                            {req.metadata?.timeImpact && (
                              <Badge variant="secondary" className="text-xs">
                                {req.metadata.timeImpact}
                              </Badge>
                            )}
                          </div>
                          <p className="text-body-small text-muted-foreground">
                            {req.description}
                          </p>
                          {req.metadata?.scopes && req.selected && (
                            <div className="pt-2">
                              <p className="text-xs text-muted-foreground mb-1">API access required:</p>
                              <div className="flex gap-1 flex-wrap">
                                {req.metadata.scopes.map(scope => (
                                  <Badge key={scope} variant="outline" className="text-xs">
                                    {scope}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {req.selected && (
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-body">Performance Priority</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={performancePriority} 
                      onValueChange={setPerformancePriority}
                      className="space-y-4"
                    >
                      <div className="flex items-start space-x-3 p-3 rounded-lg border">
                        <RadioGroupItem value="cost-optimized" id="cost-optimized" className="mt-1" />
                        <div className="space-y-1">
                          <Label htmlFor="cost-optimized" className="font-medium cursor-pointer">
                            Cost Optimized
                          </Label>
                          <p className="text-body-small text-muted-foreground">
                            Focus on minimal infrastructure costs, suitable for MVP
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 rounded-lg border">
                        <RadioGroupItem value="balanced" id="balanced" className="mt-1" />
                        <div className="space-y-1">
                          <Label htmlFor="balanced" className="font-medium cursor-pointer">
                            Balanced
                          </Label>
                          <p className="text-body-small text-muted-foreground">
                            Good performance with reasonable costs
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 rounded-lg border">
                        <RadioGroupItem value="high" id="high" className="mt-1" />
                        <div className="space-y-1">
                          <Label htmlFor="high" className="font-medium cursor-pointer">
                            High Performance
                          </Label>
                          <p className="text-body-small text-muted-foreground">
                            Maximum speed with CDN, caching, and optimizations
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side - Architecture Preview */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-body flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Architecture Preview
                  {isGeneratingPreview && (
                    <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {architecturePreview ? (
                  <>
                    <div>
                      <h3 className="font-medium text-body-small mb-1">
                        {architecturePreview.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {architecturePreview.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">
                        Tech Stack
                      </h4>
                      <div className="space-y-1">
                        {architecturePreview.techStack.map((tech, index) => (
                          <div key={index} className="flex items-center gap-2 text-body-small">
                            <Check className="w-3 h-3 text-success" />
                            {tech}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-body-small">
                        <span className="text-muted-foreground">Estimated timeline:</span>
                        <Badge variant="secondary">{architecturePreview.estimatedTime}</Badge>
                      </div>
                    </div>

                    {architecturePreview.recommendations.length > 0 && (
                      <div className="pt-2 border-t border-border">
                        <h4 className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">
                          Recommendations
                        </h4>
                        <div className="space-y-2">
                          {architecturePreview.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-2 text-xs">
                              <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-body-small">
                    Select requirements to see architecture preview
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proceed Button */}
            <Card>
              <CardContent className="pt-6">
                <Button onClick={handleProceed} className="w-full">
                  Continue to Journey Map
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Next: Visualize the user journey and key screens
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}