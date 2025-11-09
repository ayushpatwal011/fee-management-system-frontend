import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  User,

  Coins,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";


interface AppSidebarProps {
  email?: string;
}

export function AppSidebar({ email }: AppSidebarProps) {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Pay Fee", icon: Coins, path: "/payfee" },
    { label: "Courses", icon: BookOpen, path: "/courses" },
    { label: "Students", icon: Users, path: "/students" },
    { label: "Payments", icon: DollarSign, path: "/payments" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="flex flex-col h-full bg-card text-foreground transition-colors">
      {/* ===== Header ===== */}
      <div className="p-4 border-b">
        <h1 className="font-semibold text-lg truncate">
          {email || "Admin Account"}
        </h1>
      </div>

      {/* ===== Nav Links ===== */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
          const Icon = item.icon;

          return (
            <Link to={item.path} key={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 text-[18px] font-medium transition-colors",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-6 w-6" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
