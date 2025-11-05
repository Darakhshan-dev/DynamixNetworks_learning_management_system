import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, User, LogOut, Home, Library, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isAuth = location.pathname === "/auth";
  
  // Simulate auth state (in real app, this would come from auth context)
  const isLoggedIn = !["/", "/auth"].includes(location.pathname);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LearnHub</span>
          </Link>

          {!isAuth && (
            <>
              {isLoggedIn ? (
                <div className="flex items-center gap-6">
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/courses"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === "/courses" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Library className="h-4 w-4" />
                    Courses
                  </Link>
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === "/profile" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/" className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-gradient-to-r from-primary to-primary-light hover:opacity-90">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
