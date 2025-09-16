import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GripVertical } from "lucide-react";

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

interface FeatureCardProps {
  feature: Feature;
  isDragging?: boolean;
}

export function FeatureCard({ feature, isDragging = false }: FeatureCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: feature.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getValueEffortRatio = () => {
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

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isSortableDragging || isDragging 
          ? 'shadow-large scale-105 rotate-3 opacity-80 z-50' 
          : 'hover:shadow-medium'
      } ${feature.isMVP ? 'ring-1 ring-primary/20 bg-primary/5' : ''}`}
      {...attributes}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div 
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Drag ${feature.title}`}
          >
            <GripVertical className="w-4 h-4" />
          </div>
          
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-body-small font-medium leading-tight">
                  {feature.title}
                </h3>
                {feature.isMVP && (
                  <Badge variant="default" className="text-xs">MVP</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>

            {/* Effort Badge */}
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={`text-xs ${getEffortColor(feature.estimatedEffort)}`}
              >
                {feature.estimatedEffort} effort
              </Badge>
              
              <div className="text-xs text-muted-foreground">
                Value: {feature.valueScore}/100
              </div>
            </div>

            {/* Value vs Effort Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Value vs Effort</span>
                <span>{getValueEffortRatio()}/100</span>
              </div>
              <Progress 
                value={Math.max(0, getValueEffortRatio())} 
                className="h-1.5"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}