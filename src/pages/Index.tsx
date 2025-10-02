import { useState } from "react";
import { Clock, FolderOpen, Sparkles, Filter } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { KPICard } from "@/components/dashboard/KPICard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const kpiData = [
  {
    title: "Avg Time to PRD",
    value: "2.4 hrs",
    change: { value: "32% faster", trend: "up" as const },
    icon: Clock,
  },
  {
    title: "Projects Created",
    value: "24",
    change: { value: "8 this month", trend: "up" as const },
    icon: FolderOpen,
  },
  {
    title: "AI Suggestions Used",
    value: "156",
    change: { value: "12% more", trend: "up" as const },
    icon: Sparkles,
  },
];

const mockProjects = [
  {
    id: "1",
    title: "Mobile Banking App Redesign",
    description: "Complete overhaul of the mobile banking experience with focus on accessibility and user engagement.",
    status: "in-progress" as const,
    lastUpdated: "2 hours ago",
    tags: ["Fintech", "Mobile", "UX"],
  },
  {
    id: "2", 
    title: "AI-Powered Customer Support",
    description: "Implementation of chatbot and automated support workflows to reduce response times.",
    status: "draft" as const,
    lastUpdated: "1 day ago",
    tags: ["AI", "Support", "Automation"],
  },
  {
    id: "3",
    title: "E-commerce Analytics Dashboard",
    description: "Real-time analytics platform for tracking sales, user behavior, and inventory management.",
    status: "completed" as const,
    lastUpdated: "3 days ago",
    tags: ["Analytics", "Dashboard", "E-commerce"],
  },
  {
    id: "4",
    title: "Social Media Integration",
    description: "Cross-platform social media management tools with scheduling and analytics.",
    status: "exported" as const,
    lastUpdated: "1 week ago",
    tags: ["Social", "Integration", "Marketing"],
  },
];

const Index = () => {
  const [filter, setFilter] = useState("all");
  const [projects] = useState(mockProjects);

  // Show empty state if no projects
  const showEmptyState = projects.length === 0;

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true;
    return project.status === filter;
  });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Welcome back, Alex 👋
            </h1>
            <p className="text-sm sm:text-base text-text-secondary">
              Here's what's happening with your projects today.
            </p>
          </div>

          {showEmptyState ? (
            <EmptyState />
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {kpiData.map((kpi, index) => (
                  <KPICard 
                    key={kpi.title}
                    {...kpi}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                  />
                ))}
              </div>

              {/* Projects Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">Recent Projects</h2>
                  <div className="flex items-center gap-3">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter projects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="exported">Exported</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="button-secondary hidden sm:flex">
                      View All
                    </Button>
                  </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      {...project}
                      onClick={() => console.log(`Opening project ${project.id}`)}
                      style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Index;
