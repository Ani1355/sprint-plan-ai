import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, FolderOpen, Sparkles, Filter, ChevronRight } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis } from "recharts";
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
    data: [2.9, 2.8, 2.7, 2.6, 2.5, 2.4].map((v) => ({ value: v })),
  },
  {
    title: "Projects Created",
    value: "24",
    change: { value: "8 this month", trend: "up" as const },
    icon: FolderOpen,
    data: [10, 12, 15, 16, 20, 24].map((v) => ({ value: v })),
  },
  {
    title: "AI Suggestions Used",
    value: "156",
    change: { value: "12% more", trend: "up" as const },
    icon: Sparkles,
    data: [120, 118, 130, 142, 150, 156].map((v) => ({ value: v })),
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
    owner: { name: "Priya Patel" },
    priority: "high" as const,
    progress: 64,
  },
  {
    id: "2", 
    title: "AI-Powered Customer Support",
    description: "Implementation of chatbot and automated support workflows to reduce response times.",
    status: "draft" as const,
    lastUpdated: "1 day ago",
    tags: ["AI", "Support", "Automation"],
    owner: { name: "Jordan Lee" },
    priority: "medium" as const,
    progress: 15,
  },
  {
    id: "3",
    title: "E-commerce Analytics Dashboard",
    description: "Real-time analytics platform for tracking sales, user behavior, and inventory management.",
    status: "completed" as const,
    lastUpdated: "3 days ago",
    tags: ["Analytics", "Dashboard", "E-commerce"],
    owner: { name: "Alex Morgan" },
    priority: "low" as const,
    progress: 100,
  },
  {
    id: "4",
    title: "Social Media Integration",
    description: "Cross-platform social media management tools with scheduling and analytics.",
    status: "exported" as const,
    lastUpdated: "1 week ago",
    tags: ["Social", "Integration", "Marketing"],
    owner: { name: "Riya Singh" },
    priority: "medium" as const,
    progress: 100,
  },
];

const Index = () => {
  const [filter, setFilter] = useState("all");
  const [projects] = useState(mockProjects);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleHomeKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate("/");
    }
  };

  // Show empty state if no projects
  const showEmptyState = projects.length === 0;

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true;
    return project.status === filter;
  });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
          {/* Breadcrumbs + Welcome */}
          <div className="flex flex-col gap-2">
            <nav className="flex items-center text-xs sm:text-sm text-text-muted gap-1" aria-label="Breadcrumb">
              <button
                type="button"
                aria-label="Go to home"
                onClick={handleHomeClick}
                onKeyDown={handleHomeKeyDown}
                className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded px-1 cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3 h-3" aria-hidden="true" />
              <span className="text-foreground font-medium px-1">Dashboard</span>
            </nav>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
                Welcome back, Alex 👋
              </h1>
              <p className="text-sm sm:text-base text-text-secondary">
                Here's what's happening with your projects today.
              </p>
            </div>
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

              {/* Mini Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="card-elevated p-4 sm:p-6 lg:col-span-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-text-secondary">Last 6 periods</p>
                    <Select value={"6"} onValueChange={() => {}}>
                      <SelectTrigger className="w-36 min-h-[40px]"><SelectValue placeholder="Timeframe" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">Last 6</SelectItem>
                        <SelectItem value="12">Last 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ChartContainer config={{ kpi: { label: "Projects", color: "hsl(var(--primary))" } }} className="h-28">
                    <LineChart data={[10,12,15,16,20,24].map((v,i)=>({i, value:v}))} margin={{left:0,right:8,top:4,bottom:0}}>
                      <XAxis dataKey="i" hide />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Projects Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">Recent Projects</h2>
                  <div className="flex items-center gap-3">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-full sm:w-48 min-h-[44px]">
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
                    <Button variant="outline" className="button-secondary hidden sm:flex min-h-[44px]">
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
  );
};

export default Index;
