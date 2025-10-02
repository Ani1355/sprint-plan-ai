import { Search, Bell, Plus, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 bg-card border-b border-border">
      {/* Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-full sm:max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <Input 
            placeholder="Search projects..." 
            className="pl-10 pr-4 h-10 input-field text-sm"
            aria-label="Search projects and templates"
          />
        </div>
      </div>
    </header>
  );
}