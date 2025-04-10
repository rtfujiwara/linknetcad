
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8">
      <Link to="/">
        <img
          src="/lovable-uploads/d03abdb3-b61b-43e7-b5d4-4983ff5fcf27.png"
          alt="Linknet Vale Logo"
          className="w-32 md:w-40"
        />
      </Link>
      <div className="flex gap-2">
        <Button onClick={onLogout} variant="outline" className="flex items-center gap-1">
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}
