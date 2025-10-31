import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Calendar,
  TrendingUp,
  Apple,
  CreditCard,
  DollarSign,
  Settings,
  LogOut,
  Zap,
  Bell,
  Dumbbell,
} from "lucide-react";
import { toast } from "react-toastify";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Main navigation items (shown in bottom nav on mobile, top nav on desktop)
  const mainNavItems = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "My Training", path: "/training", icon: Dumbbell },
    { name: "My Account", path: "/account", icon: User },
  ];

  // Training submenu items
  const trainingSubItems = [
    {
      name: "Workout Schedule",
      path: "/schedule",
      icon: Calendar,
      description: "Your daily workout plans",
    },
    {
      name: "Diet Plan",
      path: "/diet",
      icon: Apple,
      description: "Your nutrition plan",
    },
  ];

  // Profile submenu items
  const profileSubItems = [
    {
      name: "My Profile",
      path: "/profile",
      icon: User,
      description: "View and edit your profile",
    },
    {
      name: "Membership",
      path: "/membership",
      icon: CreditCard,
      description: "View your membership details",
    },
    {
      name: "Payments",
      path: "/payments",
      icon: DollarSign,
      description: "View payment history",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      description: "App settings and preferences",
    },
  ];

  const isActive = (path) => location.pathname === path;
  const isInProfileSection = profileSubItems.some(
    (item) => item.path === location.pathname
  );
  const isInTrainingSection = trainingSubItems.some(
    (item) => item.path === location.pathname
  );
  const isInAccountSection = [
    "/account",
    "/profile",
    "/membership",
    "/payments",
    "/settings",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black pb-20 lg:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-black text-white uppercase">
                  FitLife Gym
                </h1>
                <p className="text-xs text-orange-100 font-medium -mt-1">
                  Member Portal
                </p>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-2">
              {/* All main nav items */}
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active =
                  isActive(item.path) ||
                  (item.path === "/account" && isInAccountSection) ||
                  (item.path === "/training" && isInTrainingSection);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      active
                        ? "bg-white text-orange-600 shadow-lg"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side - Notifications & Profile */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-white hover:bg-white/20 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-white/20">
                <div className="text-right">
                  <p className="text-white font-bold text-sm">
                    {user?.email?.split("@")[0] || "Member"}
                  </p>
                  <p className="text-orange-100 text-xs">Active</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white hover:bg-white/20 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 z-40 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.path === "/account"
                ? isInAccountSection
                : item.path === "/training"
                ? isInTrainingSection
                : isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[60px] ${
                  active ? "text-orange-400" : "text-gray-400"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    active ? "text-orange-400" : "text-gray-400"
                  }`}
                />
                <span className="text-xs font-bold">{item.name}</span>
                {active && (
                  <div className="w-1 h-1 bg-orange-400 rounded-full mt-0.5"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
