import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  ChevronRight,
  Eye,
  AlertTriangle,
  Undo,
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { FeatureCard } from "@/components/moscow/FeatureCard";
import { DroppableColumn } from "@/components/moscow/DroppableColumn";
import { ConflictDialog } from "@/components/moscow/ConflictDialog";

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

interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  featureId: string;
  fromCategory: string;
  toCategory: string;
}

const COLUMNS = [
  { id: 'Must', title: 'Must Have', color: 'bg-error/10 border-error/20' },
  { id: 'Should', title: 'Should Have', color: 'bg-warning/10 border-warning/20' },
  { id: 'Could', title: 'Could Have', color: 'bg-primary/10 border-primary/20' },
  { id: 'Won\'t', title: 'Won\'t Have', color: 'bg-muted border-border' }
];

export default function MoscowBoard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { projectData, visionData, features: initialFeatures } = location.state || {};
  
  if (!projectData || !visionData || !initialFeatures) {
    return <Navigate to="/" replace />;
  }

  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [showMVPOnly, setShowMVPOnly] = useState(false);
  const [conflictFeature, setConflictFeature] = useState<Feature | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastAction, setLastAction] = useState<HistoryEntry | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getColumnFeatures = (columnId: string) => {
    return features.filter(feature => 
      feature.category === columnId && 
      (!showMVPOnly || feature.isMVP)
    );
  };

  const getColumnStats = (columnId: string) => {
    const columnFeatures = getColumnFeatures(columnId);
    const count = columnFeatures.length;
    const totalEffort = columnFeatures.reduce((sum, feature) => {
      const effortValues = { Low: 1, Medium: 3, High: 5 };
      return sum + effortValues[feature.estimatedEffort];
    }, 0);
    
    return { count, totalEffort };
  };

  const handleDragStart = (event: DragStartEvent) => {
    const feature = features.find(f => f.id === event.active.id);
    setActiveFeature(feature || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveFeature(null);

    if (!over || !active) return;

    const featureId = active.id as string;
    const newCategory = over.id as string;
    const feature = features.find(f => f.id === featureId);
    
    if (!feature || feature.category === newCategory) return;

    // Check for conflicts (required features moved to Won't)
    if (newCategory === 'Won\'t' && feature.isMVP) {
      setConflictFeature(feature);
      return;
    }

    moveFeature(featureId, newCategory, feature.category);
  };

  const moveFeature = (featureId: string, newCategory: string, oldCategory: string) => {
    const historyEntry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      action: `Moved feature to ${newCategory}`,
      featureId,
      fromCategory: oldCategory,
      toCategory: newCategory
    };

    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, category: newCategory as Feature['category'] }
        : feature
    ));

    setHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
    setLastAction(historyEntry);

    // Show undo toast
    sonnerToast("Feature moved", {
      description: `Moved to ${newCategory}`,
      action: {
        label: "Undo",
        onClick: () => undoLastAction(historyEntry)
      },
      duration: 5000
    });

    // Update aria-live region
    const liveRegion = document.getElementById('drag-announcements');
    if (liveRegion) {
      liveRegion.textContent = `Feature moved to ${newCategory}`;
    }
  };

  const undoLastAction = (action: HistoryEntry) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === action.featureId 
        ? { ...feature, category: action.fromCategory as Feature['category'] }
        : feature
    ));
    
    setLastAction(null);
    toast({
      title: "Action undone",
      description: "Feature moved back to original position"
    });
  };

  const handleConflictResolve = (action: 'keep' | 'remove_mvp') => {
    if (!conflictFeature) return;

    if (action === 'keep') {
      moveFeature(conflictFeature.id, 'Won\'t', conflictFeature.category);
    } else {
      // Remove from MVP and move to Could instead
      setFeatures(prev => prev.map(feature => 
        feature.id === conflictFeature.id 
          ? { ...feature, isMVP: false, category: 'Could' }
          : feature
      ));
      toast({
        title: "Feature moved to Could Have",
        description: "Removed from MVP as suggested"
      });
    }
    
    setConflictFeature(null);
  };

  const handleProceed = () => {
    navigate("/project/technical-needs", { 
      state: { 
        projectData, 
        visionData,
        features: features
      }
    });
  };

  const mustCount = features.filter(f => f.category === 'Must').length;
  const mvpCount = features.filter(f => f.isMVP).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Accessibility - Screen reader announcements */}
      <div 
        id="drag-announcements" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      />

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="min-h-[44px] shrink-0">
                <ArrowLeft className="w-4 h-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">MoSCoW Prioritization</h1>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                  Organize features by priority for {projectData.projectName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <Switch 
                  id="mvp-view"
                  checked={showMVPOnly}
                  onCheckedChange={setShowMVPOnly}
                />
                <label htmlFor="mvp-view" className="text-xs sm:text-sm flex items-center gap-1 cursor-pointer">
                  <Eye className="w-3 h-3" aria-hidden="true" />
                  <span className="hidden sm:inline">MVP View</span>
                  <span className="sm:hidden">MVP</span>
                </label>
              </div>
              
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <span className="hidden sm:inline">{mvpCount} MVP Features</span>
                <span className="sm:hidden">{mvpCount} MVP</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Warnings */}
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          {mustCount < 4 && (
            <Card className="border-warning bg-warning/10">
              <CardContent className="py-3 sm:py-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs sm:text-sm">
                    <strong>Small scope detected:</strong> Consider adding more Must-have features. Recommended minimum: 4 features.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {mustCount > 10 && (
            <Card className="border-error bg-error/10">
              <CardContent className="py-3 sm:py-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs sm:text-sm">
                    <strong>High scope risk:</strong> Consider moving some Must-have features to Should or Could to reduce risk.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* MoSCoW Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {COLUMNS.map(column => {
              const columnFeatures = getColumnFeatures(column.id);
              const stats = getColumnStats(column.id);
              
              return (
                <div key={column.id} className="space-y-4">
                  {/* Column Header */}
                  <Card className={`${column.color} transition-colors`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-body flex items-center justify-between">
                        <span>{column.title}</span>
                        <Badge variant="outline">{stats.count}</Badge>
                      </CardTitle>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Total effort: {stats.totalEffort}</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          Export
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Droppable Column */}
                  <DroppableColumn columnId={column.id}>
                    <SortableContext 
                      items={columnFeatures.map(f => f.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3 min-h-[200px]">
                        {columnFeatures.map(feature => (
                          <FeatureCard key={feature.id} feature={feature} />
                        ))}
                        
                        {columnFeatures.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-body-small border-2 border-dashed border-border rounded-lg">
                            Drop features here
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </DroppableColumn>
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeFeature && (
              <div className="rotate-6 opacity-80">
                <FeatureCard feature={activeFeature} isDragging />
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {/* History Panel */}
        {history.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-body flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {history.slice(0, 3).map(entry => {
                  const feature = features.find(f => f.id === entry.featureId);
                  return (
                    <div key={entry.id} className="flex items-center justify-between text-body-small">
                      <span>{feature?.title} moved to {entry.toCategory}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                        {entry === lastAction && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => undoLastAction(entry)}
                            className="h-6 px-2"
                          >
                            <Undo className="w-3 h-3 mr-1" />
                            Undo
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proceed Button */}
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleProceed} className="w-full">
              Continue to Technical Needs
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Next: Define authentication, integrations, and performance requirements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conflict Dialog */}
      <ConflictDialog
        feature={conflictFeature}
        onResolve={handleConflictResolve}
        onCancel={() => setConflictFeature(null)}
      />
    </div>
  );
}