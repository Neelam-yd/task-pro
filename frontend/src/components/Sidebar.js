"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  LogOut,
  CheckCircle,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setRole(user.role || "member");
    setName(user.name || "");
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "member"] },
    { label: "Projects",  href: "/projects",  icon: FolderKanban,    roles: ["admin", "member"] },
    { label: "Tasks",     href: "/tasks",     icon: CheckSquare,     roles: ["admin", "member"] },
    { label: "Team",      href: "/team",      icon: Users,           roles: ["admin"] }, // admin only
  ];

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

      {/* Role Badge */}
      <div className="px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Shield size={14} className={role === "admin" ? "text-blue-600" : "text-gray-400"} />
          <span className="text-xs font-semibold text-gray-500">{name}</span>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${
          role === "admin"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-600"
        }`}>
          {role === "admin" ? "👑 Admin" : "👤 Member"}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems
          .filter(item => item.roles.includes(role))
          .map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}>
                  <Icon
                    size={18}
                    className={active ? "text-blue-600" : "text-gray-400"}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className={`text-[13.5px] font-medium ${active ? "text-blue-600" : ""}`}>
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