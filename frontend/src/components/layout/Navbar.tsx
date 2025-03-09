import React from "react";
import { ArrowLeft, ArrowRight, Bell, LogOut, PanelRight } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext"; // Import useAuth for logout
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

interface NavbarProps {
  pageTitle: string;
}

const Navbar: React.FC<NavbarProps> = ({ pageTitle }) => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const { logout } = useAuth(); // Get logout function from AuthContext
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });

      // Local Storage se token hatao (Agar localStorage use ho raha ho)
      localStorage.removeItem("token");

      // State Update karo
      navigate("/login"); // Redirect to Login Page
      window.location.reload(); // Hard refresh to clear cookies instantly
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sticky top-0 z-20 w-full h-16 bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 transition-all duration-300">
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={toggleSidebar}
          className="w-full p-2 flex items-center justify-center rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
        >
          <PanelRight size={18} />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        {/* <button className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border hover:bg-secondary transition-colors duration-200 relative">
          <Bell size={18} />
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-medium text-black">
            3
          </div>
        </button> */}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border hover:bg-secondary transition-colors duration-200 relative"
        >
          <LogOut size={18} />
        </button>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">Bhagya Patel</div>
            <div className="text-xs text-muted-foreground">Task Manager</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 font-medium border-2 border-yellow-500">
            BP
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
