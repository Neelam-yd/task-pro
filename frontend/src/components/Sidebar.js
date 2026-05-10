"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Calendar,
  Settings,
  LogOut,
  CheckCircle,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects",  href: "/projects",  icon: FolderKanban },
  { label: "Tasks",     href: "/tasks",     icon: CheckSquare },
  { label: "Team",      href: "/team",      icon: Users },
 
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="w-60 min-h-screen bg-white flex flex-col shrink-0 border-r border-gray-100">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
         <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow shadow-blue-200">
                <CheckCircle size={14} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[17px] font-bold text-slate-800 tracking-tight">
                Task<span className="text-blue-600">Flow</span>
              </span>
            </Link>

      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon
                  size={18}
                  className={active ? "text-blue-600" : "text-gray-400"}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={`text-[13.5px] font-medium ${
                    active ? "text-blue-600" : ""
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Log Out */}
      <div className="px-3 pb-5 pt-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
        >
          <LogOut size={17} className="text-gray-400" strokeWidth={2} />
          <span className="text-[13.5px] font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}