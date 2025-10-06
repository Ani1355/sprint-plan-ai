import { useState } from "react";
import { MoreVertical, FolderOpen, Copy, Download, Trash2, Calendar, Tag, CheckCircle2, Clock, FileText, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "in-progress" | "completed" | "exported";
  lastUpdated: string;
  tags?: string[];
  thumbnail?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  owner?: { name: string; avatarUrl?: string };
  priority?: "high" | "medium" | "low";
  progress?: number;
}

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground", Icon: FileText },
  "in-progress": { label: "In Progress", className: "bg-warning/10 text-warning border-warning/20", Icon: Clock },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20", Icon: CheckCircle2 },
  exported: { label: "Exported", className: "bg-primary/10 text-primary border-primary/20", Icon: UploadCloud },
};

// No left priority stripe; keep simple unified border

export function ProjectCard({ 
  title, 
  description, 
  status, 
  lastUpdated, 
  tags = [], 
  thumbnail, 
  onClick,
  style,
  owner,
  priority = "medium",
  progress,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusInfo = statusConfig[status] || statusConfig.draft;

  return (
    <article 
      className={cn(
        "group relative bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-200",
        "hover:shadow-medium hover:border-primary/20 hover:-translate-y-1 active:scale-95",
        isHovered && "shadow-medium border-primary/20 -translate-y-1",
        (status === "completed" || status === "exported") && "bg-muted/20"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Thumbnail */}
      <div className="w-full h-24 sm:h-32 bg-gradient-subtle rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex items-center justify-between overflow-hidden px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {owner?.avatarUrl ? (
              <AvatarImage src={owner.avatarUrl} alt={owner.name} />
            ) : (
              <AvatarFallback aria-label={owner?.name || 'Unassigned'}>{(owner?.name || 'Unassigned').slice(0,2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-medium text-card-foreground">{owner?.name || 'Unassigned'}</span>
            <span className="text-xs text-text-muted">Owner</span>
          </div>
        </div>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-12 w-20 object-cover rounded-md" />
        ) : (
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-gradient-brand/10">
            <FolderOpen className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2 sm:space-y-3">
        {/* Title & Actions */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-card-foreground line-clamp-2 flex-1">
            {title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 sm:transition-opacity p-1 h-auto min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                aria-label="Project actions"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FolderOpen className="mr-2 h-4 w-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-text-secondary line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                <Tag className="w-3 h-3 mr-1" aria-hidden="true" />
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {typeof progress === 'number' && (
          <div className="pt-1">
            <Progress 
              value={Math.max(0, Math.min(100, progress))} 
              aria-label="Project progress" 
              className="h-2" 
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
          <Badge className={cn("px-2 py-0.5 inline-flex items-center gap-1", statusInfo.className)} aria-label={`Status: ${statusInfo.label}`}>
            <statusInfo.Icon className="w-3 h-3" aria-hidden="true" />
            {statusInfo.label}
          </Badge>
          <div className="flex items-center gap-1 text-text-muted">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <time aria-label="Last updated">{lastUpdated}</time>
          </div>
        </div>
      </div>
    </article>
  );
}