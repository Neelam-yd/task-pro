"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Search, Plus, Bell, Settings, RefreshCw,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  Clock, ChevronRight, MoreHorizontal,
} from "lucide-react";

/* ══════════════════════════════════════
   SKELETON
══════════════════════════════════════ */
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

/* ══════════════════════════════════════
   STAT CARD
══════════════════════════════════════ */
const colorMap = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-600",   iconBg: "bg-blue-100",   border: "border-blue-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-500", iconBg: "bg-orange-100", border: "border-orange-100" },
  green:  { bg: "bg-green-50",  text: "text-green-600",  iconBg: "bg-green-100",  border: "border-green-100" },
  red:    { bg: "bg-red-50",    text: "text-red-500",    iconBg: "bg-red-100",    border: "border-red-100" },
};

function StatCard({ label, value, change, changeLabel, color, Icon, loading }) {
  const c = colorMap[color];
  const isUp = change >= 0;
  return (
    <div className={`bg-white rounded-xl border ${c.border} p-4 flex flex-col gap-2.5`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 ${c.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon size={15} className={c.text} />
        </div>
      </div>
      {loading ? (
        <>
          <Skeleton className="h-8 w-16 mt-1" />
          <Skeleton className="h-3 w-28" />
        </>
      ) : (
        <>
          <p className={`text-[32px] font-black leading-none ${c.text}`}>{value}</p>
          <div className="flex items-center gap-1">
            {isUp
              ? <TrendingUp size={11} className="text-green-500" />
              : <TrendingDown size={11} className="text-red-400" />
            }
            <span className={`text-[11px] font-bold ${isUp ? "text-green-600" : "text-red-500"}`}>
              {isUp ? "+" : ""}{change}%
            </span>
            <span className="text-[11px] text-slate-400">{changeLabel}</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = {
    "In Progress": "bg-blue-100 text-blue-700",
    "To Do":       "bg-slate-100 text-slate-500",
    "Done":        "bg-green-100 text-green-700",
    "Overdue":     "bg-red-100 text-red-600",
    "On Review":   "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${map[status] || "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
}

/* ══════════════════════════════════════
   PROGRESS BAR
══════════════════════════════════════ */
function ProgressBar({ value, colorClass = "bg-blue-500" }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div className={`${colorClass} h-1.5 rounded-full`} style={{ width: `${value}%` }} />
    </div>
  );
}

/* ══════════════════════════════════════
   SPRINT DONUT CHART
══════════════════════════════════════ */
function SprintDonut({ percent, completed, total, daysLeft, label }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
          <circle cx="60" cy="60" r={r} fill="none" stroke="#2563eb" strokeWidth="12"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-black text-slate-800">{percent}%</p>
        </div>
      </div>
      <div className="text-center space-y-0.5">
        <p className="text-xs font-bold text-blue-600">{daysLeft} days left</p>
        <p className="text-[10px] text-slate-400">{label}</p>
        <p className="text-[11px] text-slate-500">{completed} of {total} issues completed</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   ISSUE STATUS DONUT
══════════════════════════════════════ */
const ISSUE_COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#22c55e"];

function IssueDonut({ total, breakdown }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  let cumPct = 0;

  const slices = breakdown.map((item, i) => {
    const pct = (item.count / total) * 100;
    const offset = circ - (pct / 100) * circ;
    const rotation = (cumPct / 100) * 360 - 90;
    cumPct += pct;
    return { ...item, pct, offset, rotation, color: ISSUE_COLORS[i] };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-5">
        <div className="relative w-28 h-28 shrink-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {slices.map((s) => (
              <circle key={s.status} cx="50" cy="50" r={r} fill="none"
                stroke={s.color} strokeWidth="12"
                strokeDasharray={circ} strokeDashoffset={s.offset}
                style={{ transform: `rotate(${s.rotation}deg)`, transformOrigin: "50% 50%" }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-black text-slate-800">{total}</p>
            <p className="text-[9px] text-slate-400 leading-tight text-center">Total<br />Issues</p>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          {slices.map((s) => (
            <div key={s.status} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-[11px] text-slate-500">{s.status}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-700">{s.count}</span>
                <span className="text-[10px] text-slate-400 w-8 text-right">({Math.round(s.pct)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════ */
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState(null);
  const [projects, setProjects] = useState([]);
  const [sprint, setSprint]   = useState(null);
  const [activity, setActivity] = useState([]);
  const [issues, setIssues]   = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [sRes, pRes, spRes, aRes, iRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/projects"),
          fetch("/api/dashboard/sprint"),
          fetch("/api/dashboard/activity"),
          fetch("/api/dashboard/issues"),
        ]);
        if (sRes.ok)  setStats(await sRes.json());
        if (pRes.ok)  setProjects(await pRes.json());
        if (spRes.ok) setSprint(await spRes.json());
        if (aRes.ok)  setActivity(await aRes.json());
        if (iRes.ok)  setIssues(await iRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ── Fallback data until API responds ── */
  const S = stats || {
    openIssues:    { value: 24, change: 12,  label: "vs last week" },
    inProgress:    { value: 43, change: 8,   label: "vs last week" },
    doneIssues:    { value: 72, change: 5,   label: "vs last week" },
    overdueIssues: { value: 9,  change: -3,  label: "vs last week" },
  };

  const P = projects.length > 0 ? projects : [
    { id: 1, name: "Website Redesign",  colorClass: "bg-blue-500",   progress: 68, status: "In Progress", issues: 24 },
    { id: 2, name: "Mobile App",        colorClass: "bg-green-500",  progress: 78, status: "In Progress", issues: 18 },
    { id: 3, name: "Customer Portal",   colorClass: "bg-orange-400", progress: 45, status: "On Review",   issues: 31 },
    { id: 4, name: "Marketing Site",    colorClass: "bg-purple-500", progress: 40, status: "To Do",       issues: 19 },
    { id: 5, name: "Admin Dashboard",   colorClass: "bg-red-400",    progress: 90, status: "In Progress", issues: 12 },
  ];

  const SP = sprint || {
    percent: 60, completed: 42, total: 70, daysLeft: 12,
    label: "Sprint 24 · Jan 15 – Jan 26",
  };

  const A = activity.length > 0 ? activity : [
    { id: 1, user: "Sarah",  initials: "SR", action: "updated issue TF-101 · Fix: update for dashboard", time: "1m ago" },
    { id: 2, user: "Mike",   initials: "MJ", action: "commented on TF-98 · Fix logic visualisation",     time: "7m ago" },
    { id: 3, user: "Julian", initials: "JC", action: "changed status TF-94 · API: who's not working",    time: "21m ago" },
    { id: 4, user: "Alex",   initials: "AS", action: "created issue TF-110 · Add analytics thinking",    time: "1h ago" },
  ];

  const I = issues || {
    total: 261,
    breakdown: [
      { status: "Open",        count: 128 },
      { status: "In Progress", count: 40  },
      { status: "In Review",   count: 30  },
      { status: "Done",        count: 63  },
    ],
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">

        {/* ── TOPBAR ── */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <h1 className="text-[15px] font-bold text-slate-800">Dashboard</h1>
          <div className="flex items-center gap-2.5">
            <div className="relative hidden md:flex items-center">
              <Search size={12} className="absolute left-3 text-slate-400 pointer-events-none" />
              <input type="text" placeholder="Search anything..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-52 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              />
            </div>
            <button className="w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center shadow shadow-blue-200 transition">
              <Plus size={14} className="text-white" />
            </button>
            <button className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center relative transition">
              <Bell size={13} className="text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition">
              <Settings size={13} className="text-slate-600" />
            </button>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main className="flex-1 p-5 space-y-4 overflow-y-auto">

          {/* STAT CARDS */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <StatCard label="Open Issues"    value={S.openIssues.value}    change={S.openIssues.change}    changeLabel={S.openIssues.label}    color="blue"   Icon={AlertCircle}   loading={loading} />
            <StatCard label="In Progress"    value={S.inProgress.value}    change={S.inProgress.change}    changeLabel={S.inProgress.label}    color="orange" Icon={Clock}         loading={loading} />
            <StatCard label="Done Issues"    value={S.doneIssues.value}    change={S.doneIssues.change}    changeLabel={S.doneIssues.label}    color="green"  Icon={CheckCircle2}  loading={loading} />
            <StatCard label="Overdue Issues" value={S.overdueIssues.value} change={S.overdueIssues.change} changeLabel={S.overdueIssues.label} color="red"    Icon={AlertCircle}   loading={loading} />
          </div>

          {/* PROJECTS + SPRINT */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Projects Table */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Projects Overview</h2>
                <button className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline">
                  View all <ChevronRight size={12} />
                </button>
              </div>

              {/* Header */}
              <div className="grid grid-cols-12 px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/60">
                <span className="col-span-4">Project</span>
                <span className="col-span-3">Progress</span>
                <span className="col-span-3">Status</span>
                <span className="col-span-2 text-right">Issues</span>
              </div>

              {/* Rows */}
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-12 items-center px-5 py-3 border-b border-slate-50 gap-2">
                    <div className="col-span-4 flex items-center gap-2"><Skeleton className="w-2.5 h-2.5 rounded-sm" /><Skeleton className="h-3 w-24" /></div>
                    <div className="col-span-3"><Skeleton className="h-1.5 w-full rounded-full" /></div>
                    <div className="col-span-3"><Skeleton className="h-4 w-16 rounded-full" /></div>
                    <div className="col-span-2"><Skeleton className="h-3 w-6 ml-auto" /></div>
                  </div>
                ))
                : P.map((p) => (
                  <div key={p.id} className="grid grid-cols-12 items-center px-5 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition group">
                    <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-sm ${p.colorClass} shrink-0`} />
                      <span className="text-[12px] font-medium text-slate-700 truncate">{p.name}</span>
                    </div>
                    <div className="col-span-3 pr-3">
                      <div className="flex items-center gap-1.5">
                        <ProgressBar value={p.progress} colorClass={p.colorClass} />
                        <span className="text-[10px] text-slate-400 shrink-0">{p.progress}%</span>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="text-[12px] font-semibold text-slate-600">{p.issues}</span>
                      <button className="opacity-0 group-hover:opacity-100 transition">
                        <MoreHorizontal size={13} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Sprint */}
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Sprint 24 Progress</h2>
                <button className="w-6 h-6 hover:bg-slate-100 rounded-lg flex items-center justify-center transition">
                  <RefreshCw size={12} className="text-slate-400" />
                </button>
              </div>
              <div className="flex items-center justify-center p-5">
                {loading
                  ? <Skeleton className="w-36 h-36 rounded-full" />
                  : <SprintDonut percent={SP.percent} completed={SP.completed} total={SP.total} daysLeft={SP.daysLeft} label={SP.label} />
                }
              </div>
            </div>
          </div>

          {/* ACTIVITY + ISSUES */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Activity Feed */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Activity Feed</h2>
                <button className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline">
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                      <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2 pt-0.5">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-2.5 w-16" />
                      </div>
                    </div>
                  ))
                  : A.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                        {a.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-slate-600 leading-relaxed">
                          <span className="font-semibold text-slate-800">{a.user} </span>
                          {a.action}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 pt-0.5">{a.time}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Issue Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="px-5 py-3.5 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Issue Status Breakdown</h2>
              </div>
              <div className="p-5">
                {loading
                  ? <div className="flex items-center gap-4">
                    <Skeleton className="w-28 h-28 rounded-full shrink-0" />
                    <div className="space-y-2.5 flex-1">
                      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-3 w-full" />)}
                    </div>
                  </div>
                  : <IssueDonut total={I.total} breakdown={I.breakdown} />
                }

                {!loading && (
                  <div className="mt-4 bg-slate-50 rounded-xl p-3 space-y-2.5">
                    {I.breakdown.map((item, i) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ISSUE_COLORS[i] }} />
                          <span className="text-[11px] text-slate-500">{item.status}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-700">{item.count}</span>
                          <span className="text-[10px] text-slate-400">
                            ({Math.round((item.count / I.total) * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

