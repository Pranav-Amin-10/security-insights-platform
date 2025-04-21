
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertCircle, Lock, Shield, Activity, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield size={24} />
            <h1 className="text-xl font-bold">Security Insights Platform</h1>
          </div>
          <div className="text-sm">Enterprise Cybersecurity Solution</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md flex-shrink-0">
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/" 
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-colors", 
                    isActive("/") 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "hover:bg-gray-100"
                  )}
                >
                  <Home size={18} />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/vapt" 
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-colors", 
                    isActive("/vapt") 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "hover:bg-gray-100"
                  )}
                >
                  <AlertCircle size={18} />
                  VAPT Module
                </Link>
              </li>
              <li>
                <Link 
                  to="/compliance" 
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-colors", 
                    isActive("/compliance") 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "hover:bg-gray-100"
                  )}
                >
                  <Activity size={18} />
                  Compliance Audit
                </Link>
              </li>
              <li>
                <Link 
                  to="/ssl" 
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-colors", 
                    isActive("/ssl") 
                      ? "bg-blue-100 text-blue-800 font-medium" 
                      : "hover:bg-gray-100"
                  )}
                >
                  <Lock size={18} />
                  SSL/TLS Checker
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-3 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Security Insights Platform | All Rights Reserved
        </div>
      </footer>
    </div>
  );
}

export default Layout;
