import { GraduationCap, LogOut, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/context/ModeTogle";
import { useAdminStore } from "@/store/useAdminStore";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { logout } = useAdminStore();

  return (
    <nav
      className="
        fixed top-0 left-0 right-0
        z-50
        flex items-center justify-between
        px-6 py-4 border-b
        bg-card backdrop-blur
      "
    >
      {/* ===== Logo / Title ===== */}
      <a href="#" className="flex items-center gap-2 font-medium text-lg">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <GraduationCap className="size-4" />
        </div>
        Fees Management System
      </a>

      {/* ===== Right Section ===== */}
      <div className="flex items-center gap-2">
        {/* Dark / Light Mode Toggle */}
        <ModeToggle />

        {/* Admin Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="/admin.jpg" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin</DropdownMenuLabel>

            <DropdownMenuItem className="flex items-center gap-2">
              <User className="size-4" />
              <Link to="/profile">Update Profile</Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 text-red-600"
              onClick={logout}
            >
              <LogOut className="size-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
