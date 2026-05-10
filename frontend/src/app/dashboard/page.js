'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  Calendar, Settings, LogOut, Search, Bell,
  FolderOpen, CheckCircle2, Clock, AlertCircle, Plus
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

/* ── SIDEBAR NAV ITEMS ───────────────────────────────── */
const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects",  href: "/projects",  icon: FolderKanban },
  { label: "Tasks",     href: "/tasks",     icon: CheckSquare },
  { label: "Team",      href: "/team",      icon: Users },
  { label: "Calendar",  href: "/calendar",  icon: Calendar },
  { label: "Settings",  href: "/settings",  icon: Settings },
];

/* ── STATUS CONFIG ───────────────────────────────────── */
const statusConfig = {
  "completed":   { label: "Completed",   cls: "bg-green-100 text-green-700" },
  "in-progress": { label: "In Progress", cls: "bg-yellow-100 text-yellow-700" },
  "pending":     { label: "Pending",     cls: "bg-blue-100 text-blue-600" },
  "todo":        { label: "Pending",     cls: "bg-blue-100 text-blue-600" },
};

const avatarColors = [
  "bg-green-500", "bg-pink-500", "bg-blue-500",
  "bg-orange-500", "bg-purple-500", "bg-indigo-500",
];

function getInitial(name = "") { return name.charAt(0).toUpperCase(); }

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
}

/* ── STAT CARD ───────────────────────────────────────── */
function StatCard({ iconBg, iconColor, icon: Icon, label, value, sublabel }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm flex-1">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={26} className={iconColor} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-4xl font-bold text-gray-900 leading-tight">{value ?? 0}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN DASHBOARD
   ══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const pathname = usePathname();

  const [user, setUser]             = useState(null);
  const [stats, setStats]           = useState({});
  const [tasks, setTasks]           = useState([]);
  const [projects, setProjects]     = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token      = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (!token) { window.location.href = "/login"; return; }
        setUser(storedUser);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
          headers: { Authorization: token },
        });
        if (!res.ok) { window.location.href = "/login"; return; }

        const data = await res.json();
        setStats(data.stats         || {});
        setTasks(data.tasks         || []);
        setProjects(data.projects   || []);
        setActivities(data.activities || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  /* loading spinner */
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  const displayName  = user?.name  || "User";
  const displayEmail = user?.email || "";
  const userInitial  = getInitial(displayName);

  /* fallback demo activities when DB is empty */
 const displayActivities = activities.length > 0 ? activities : [
    { _id:"1",  userName:"Aman",        userInitial:"A", userColor:"bg-green-500",  text:'completed "Login API"',           timeAgo:"2h ago" },
    { _id:"2",  userName:"Priya",       userInitial:"P", userColor:"bg-pink-500",   text:'commented on "Dashboard UI"',    timeAgo:"4h ago" },
    { _id:"3",  userName:"Rahul",       userInitial:"R", userColor:"bg-blue-500",   text:"created a new task",              timeAgo:"1d ago" },
    { _id:"4",  userName:"Sneha",       userInitial:"S", userColor:"bg-orange-500", text:'updated "Project Settings"',     timeAgo:"1d ago" },
    { _id:"5",  userName:displayName,   userInitial:userInitial, userColor:"bg-indigo-500", text:"added a new team member", timeAgo:"2d ago" },
    { _id:"6",  userName:"Karan",       userInitial:"K", userColor:"bg-teal-500",   text:'marked "Bug Fix #42" as done',   timeAgo:"2d ago" },
    { _id:"7",  userName:"Divya",       userInitial:"D", userColor:"bg-rose-500",   text:'uploaded files to "Design Sprint"', timeAgo:"3d ago" },
    { _id:"8",  userName:"Mohit",       userInitial:"M", userColor:"bg-amber-500",  text:'assigned "API Integration" to Priya', timeAgo:"3d ago" },
    { _id:"9",  userName:"Aman",        userInitial:"A", userColor:"bg-green-500",  text:'reopened "Auth issue"',           timeAgo:"4d ago" },
    { _id:"10", userName:"Sneha",       userInitial:"S", userColor:"bg-orange-500", text:'commented on "Sprint Planning"', timeAgo:"4d ago" },
    { _id:"11", userName:"Rahul",       userInitial:"R", userColor:"bg-blue-500",   text:'closed milestone "v1.0 Launch"', timeAgo:"5d ago" },
    { _id:"12", userName:"Priya",       userInitial:"P", userColor:"bg-pink-500",   text:'created "Q3 Roadmap" project',   timeAgo:"5d ago" },
  ];

  /* show ALL tasks (scrollable now) */
  const displayTasks = tasks;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

     <Sidebar/>

      {/* ════════════════════════════════════
          MAIN CONTENT AREA
          ════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP BAR */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Here's what's happening with your work today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search bar */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks or projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>

            {/* Notification bell */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition">
              <Bell size={16} className="text-gray-500" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>

            {/* User avatar */}
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              {userInitial}
            </div>
          </div>
        </header>

        {/* SCROLLABLE PAGE BODY */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* ── STAT CARDS ROW ── */}
          <div className="flex gap-4">
            <StatCard
              iconBg="bg-blue-50"   iconColor="text-blue-500"
              icon={FolderOpen}
              label="Total Projects"  value={stats.totalProjects  ?? 0} sublabel="Active projects"
            />
            <StatCard
              iconBg="bg-green-50"  iconColor="text-green-500"
              icon={CheckCircle2}
              label="Tasks Completed" value={stats.tasksCompleted ?? 0} sublabel="This month"
            />
            <StatCard
              iconBg="bg-yellow-50" iconColor="text-yellow-500"
              icon={Clock}
              label="Pending Tasks"   value={stats.pendingTasks   ?? 0} sublabel="In progress"
            />
            <StatCard
              iconBg="bg-red-50"    iconColor="text-red-500"
              icon={AlertCircle}
              label="Overdue Tasks"   value={stats.overdueTasks   ?? 0} sublabel="Need attention"
            />
          </div>

          {/* ── MY TASKS + RECENT ACTIVITY ── */}
          <div className="flex gap-6">

            {/* MY TASKS TABLE — fixed height, scrollable body */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col" style={{ maxHeight: "380px" }}>
              <div className="flex items-center justify-between mb-5 shrink-0">
                <h2 className="font-semibold text-gray-900 text-base">My Tasks</h2>
                <Link href="/tasks" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>

              {displayTasks.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <CheckCircle2 size={36} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm">No tasks yet. Add your first task!</p>
                </div>
              ) : (
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="text-gray-400 text-xs border-b border-gray-100">
                        <th className="text-left pb-3 font-medium">Task</th>
                        <th className="text-left pb-3 font-medium">Project</th>
                        <th className="text-left pb-3 font-medium">Due Date</th>
                        <th className="text-left pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayTasks.map((task) => {
                        const st = statusConfig[task.status] || statusConfig["todo"];
                        return (
                          <tr key={task._id} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                            <td className="py-3 font-medium text-gray-800">{task.title}</td>
                            <td className="py-3 text-gray-500">{task.projectId?.name || "—"}</td>
                            <td className="py-3 text-gray-500">{formatDate(task.dueDate)}</td>
                            <td className="py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.cls}`}>
                                {st.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* RECENT ACTIVITY — fixed height, scrollable list */}
            <div className="w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col" style={{ maxHeight: "380px" }}>
              <div className="flex items-center justify-between mb-5 shrink-0">
                <h2 className="font-semibold text-gray-900 text-base">Recent Activity</h2>
                <button className="text-sm text-blue-600 hover:underline">View all</button>
              </div>
              <div className="overflow-y-auto flex-1 space-y-5 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent pr-1">
                {displayActivities.map((a, idx) => {
                  const color   = a.userColor || avatarColors[idx % avatarColors.length];
                  const initial = a.userInitial || getInitial(a.userName || "U");
                  return (
                    <div key={a._id || idx} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 leading-snug">
                          <span className="font-semibold">{a.userName}</span><br></br>{" "}{a.text}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">{a.timeAgo}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── PROJECTS OVERVIEW ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-base">Projects Overview</h2>
              <Link href="/projects" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FolderOpen size={36} className="mx-auto mb-2 text-gray-200" />
                <p className="text-sm">No projects yet. Create your first project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-5">
                {projects.slice(0, 4).map((p) => {
                  const progress = p.progress ?? 0;
                  return (
                    <div key={p._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                      <p className="font-semibold text-gray-800 text-sm mb-3">{p.name}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-8 text-right">{progress}%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Due: {formatDate(p.dueDate)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 text-base mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-4">

              <Link href="/projects">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition cursor-pointer border border-blue-100">
                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                    <Plus size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">New Project</p>
                    <p className="text-xs text-gray-500">Create a new project</p>
                  </div>
                </div>
              </Link>

              <Link href="/tasks">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition cursor-pointer border border-green-100">
                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm border border-green-100">
                    <CheckSquare size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">New Task</p>
                    <p className="text-xs text-gray-500">Add a new task</p>
                  </div>
                </div>
              </Link>

              <Link href="/team">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition cursor-pointer border border-purple-100">
                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm border border-purple-100">
                    <Users size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Invite Team</p>
                    <p className="text-xs text-gray-500">Add members to your team</p>
                  </div>
                </div>
              </Link>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}