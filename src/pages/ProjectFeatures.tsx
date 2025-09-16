import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  ThumbsUp,
  ThumbsDown,
  Zap,
  AlertTriangle,
  Filter,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Feature {
  id: string;
  title: string;
  description: string;
  valueScore: number;
  effortScore: number;
  category: 'Must' | 'Should' | 'Could' | 'Won\'t';
  isMVP: boolean;
  votes: { up: number; down: number };
  estimatedEffort: 'Low' | 'Medium' | 'High';
}

export default function ProjectFeatures() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { projectData, visionData } = location.state || {};
  
  if (!projectData || !visionData) {
    return <Navigate to="/" replace />;
  }

  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Simulate AI feature generation
    const generateFeatures = () => {
      const generatedFeatures: Feature[] = [
        {
          id: '1',
          title: 'User Authentication',
          description: 'Secure login and registration system with email verification',
          valueScore: 85,
          effortScore: 40,
          category: 'Must',
          isMVP: true,
          votes: { up: 0, down: 0 },
          estimatedEffort: 'Medium'
        },
        {
          id: '2',
          title: 'Dashboard Overview',
          description: 'Central hub showing key metrics and recent activity',
          valueScore: 90,
          effortScore: 35,
          category: 'Must',
          isMVP: true,
          votes: { up: 0, down: 0 },
          estimatedEffort: 'Medium'
        },
        {
          id: '3',
          title: 'Real-time Notifications',
          description: 'Push notifications for important updates and events',
          valueScore: 70,
          effortScore: 60,
          category: 'Should',
          isMVP: true,
          votes: { up: 0, down: 0 },
          estimatedEffort: 'High'
        },
        {
          id: '4',
          title: 'Advanced Analytics',
          description: 'Detailed analytics and reporting dashboard',
          valueScore: 75,
          effortScore: 80,
          category: 'Should',
          isMVP: false,
          votes: { up: 0, down: 0 },
          estimatedEffort: 'High'
        },
        {
          id: '5',
          title: 'Mobile App',
          description: 'Native mobile application for iOS and Android',
          valueScore: 80,
          effortScore: 90,
          category: 'Could',
          isMVP: false,
          votes: { up: 0, down: 0 },
          estimatedEffort: 'High'
        },
        {
          id: '6',
          title: 'API Documentation',
          description: 'Comprehensive API documentation with examples',
          valueScore: 60,
          effortScore: 30,
          category: 'Should',
          isMVP: true,
          votes: { up: 0, down: 0 },
          estimatedEffort: 'Low'
        },
        {
          id: '7',
          title: 'Team Collaboration',
          description: 'Multi-user workspace with role-based permissions',
          valueScore: 85,
          effortScore: 70,
          category: 'Must',
          isMVP: true,
          votes: { up: 0, down: 0 },
          estimatedEffort: 'High'
        },
        {
          id: '8',
          title: 'Export Features',
          description: 'Export data in multiple formats (PDF, CSV, JSON)',
          valueScore: 65,
          effortScore: 25,
          category: 'Should',
          isMVP: true,
          votes: { up: 0, down: 0 },
          estimatedEffort: 'Low'
        },
        {
          id: '9',
          title: 'Dark Mode',
          description: 'Dark theme option for better user experience',
          valueScore: 40,
          effortScore: 15,
          category: 'Could',
          isMVP: false,
          votes: { up: 0, down: 0 },
          estimatedEffort: 'Low'
        },
        {
          id: '10',
          title: 'Third-party Integrations',
          description: 'Integrate with popular tools and services',
          valueScore: 75,
          effortScore: 85,
          category: 'Could',
          isMVP: false,
          votes: { up: 0, down: 0 },
          estimatedEffort: 'High'
        }
      ];

      // Auto-select top 7 features for MVP
      const sortedByValue = [...generatedFeatures].sort((a, b) => (b.valueScore - b.effortScore) - (a.valueScore - a.effortScore));
      sortedByValue.slice(0, 7).forEach(feature => {
        feature.isMVP = true;
      });

      return generatedFeatures;
    };

    setTimeout(() => {
      setFeatures(generateFeatures());
      setIsGenerating(false);
      toast({
        title: "Features Generated",
        description: "AI has generated 10 features ranked by value vs effort."
      });
    }, 2000);
  }, [projectData, toast]);

  const getValueEffortRatio = (feature: Feature) => {
    return feature.valueScore - feature.effortScore;
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Low': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'High': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const handleFeatureVote = (featureId: string, voteType: 'up' | 'down') => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { 
            ...feature, 
            votes: { 
              ...feature.votes, 
              [voteType]: feature.votes[voteType] + 1 
            }
          }
        : feature
    ));
  };

  const toggleFeatureSelection = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const toggleMVP = (featureId: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, isMVP: !feature.isMVP }
        : feature
    ));
  };

  const filteredFeatures = features.filter(feature => {
    switch (activeFilter) {
      case 'MVP': return feature.isMVP;
      case 'V2': return !feature.isMVP && feature.category !== 'Won\'t';
      case 'Future': return feature.category === 'Could' || feature.category === 'Won\'t';
      default: return true;
    }
  });

  const mvpCount = features.filter(f => f.isMVP).length;
  const mustCount = features.filter(f => f.category === 'Must').length;

  const handleProceed = () => {
    navigate("/project/moscow", { 
      state: { 
        projectData, 
        visionData,
        features: features
      }
    });
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-body">Generating features based on your vision...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-heading-2 font-bold">Feature Generation</h1>
                <p className="text-body-small text-muted-foreground">
                  AI-generated features ranked by value vs effort for {projectData.projectName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {mvpCount} MVP Features
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Rail - Filters */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-body">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['All', 'MVP', 'V2', 'Future'].map(filter => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                    {filter === 'MVP' && <Badge variant="secondary" className="ml-2">{mvpCount}</Badge>}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Warnings */}
            {mvpCount < 4 && (
              <Card className="border-warning bg-warning/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-medium">MVP looks small</p>
                      <p className="text-muted-foreground">
                        Consider adding more features. Recommended minimum: 4 features.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {mustCount > 10 && (
              <Card className="border-error bg-error/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-error mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-medium">High scope risk</p>
                      <p className="text-muted-foreground">
                        Consider moving some features to V2 to reduce risk.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - Feature List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Bulk Actions */}
            {selectedFeatures.length > 0 && (
              <Card className="bg-primary/10">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-body-small">
                      {selectedFeatures.length} features selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Move to MVP
                      </Button>
                      <Button size="sm" variant="outline">
                        Move to V2
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feature Cards */}
            <div className="space-y-4">
              {filteredFeatures.map((feature, index) => (
                <Card 
                  key={feature.id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    feature.isMVP ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={() => toggleFeatureSelection(feature.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-body font-medium">{feature.title}</h3>
                              {feature.isMVP && (
                                <Badge variant="default">MVP</Badge>
                              )}
                              <Badge 
                                variant="outline" 
                                className={getEffortColor(feature.estimatedEffort)}
                              >
                                {feature.estimatedEffort} effort
                              </Badge>
                            </div>
                            <p className="text-body-small text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeatureVote(feature.id, 'up')}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              {feature.votes.up}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeatureVote(feature.id, 'down')}
                            >
                              <ThumbsDown className="w-3 h-3" />
                              {feature.votes.down}
                            </Button>
                          </div>
                        </div>

                        {/* Value vs Effort Meter */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Value vs Effort Score</span>
                            <span>{getValueEffortRatio(feature)}/100</span>
                          </div>
                          <Progress 
                            value={Math.max(0, getValueEffortRatio(feature))} 
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleMVP(feature.id)}
                            >
                              {feature.isMVP ? 'Remove from MVP' : 'Add to MVP'}
                            </Button>
                            <Button variant="ghost" size="sm">
                              Edit Details
                            </Button>
                          </div>
                          
                          <span className="text-xs text-muted-foreground">
                            Rank #{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Proceed Button */}
            <Card>
              <CardContent className="pt-6">
                <Button onClick={handleProceed} className="w-full">
                  Continue to MoSCoW Board
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Next: Organize features using the MoSCoW prioritization method
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}