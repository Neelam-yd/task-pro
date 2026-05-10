'use client';

import { useEffect, useState, useRef } from "react";
import {
  CheckSquare, CheckCircle2, Clock, AlertCircle,
  Plus, Search, Trash2, X, Loader2, ArrowUpDown
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

// ── Constants ────────────────────────────────────────────────────────────────

const TABS = ["All", "To Do", "In Progress", "Done", "Overdue"];

const PRIORITY_STYLE = {
  High:   { cls: "bg-red-50 text-red-700 border border-red-200" },
  Medium: { cls: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  Low:    { cls: "bg-green-50 text-green-700 border border-green-200" },
};

const STATUS_STYLE = {
  "In Progress": { cls: "bg-blue-50 text-blue-700 border border-blue-200",     dot: "bg-blue-500" },
  "To Do":       { cls: "bg-gray-100 text-gray-600 border border-gray-200",    dot: "bg-gray-400" },
  "Done":        { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  "Overdue":     { cls: "bg-red-50 text-red-700 border border-red-200",        dot: "bg-red-500" },
  "todo":        { cls: "bg-gray-100 text-gray-600 border border-gray-200",    dot: "bg-gray-400" },
  "in-progress": { cls: "bg-blue-50 text-blue-700 border border-blue-200",     dot: "bg-blue-500" },
  "completed":   { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  "pending":     { cls: "bg-gray-100 text-gray-600 border border-gray-200",    dot: "bg-gray-400" },
};

const STATUS_PROGRESS = {
  "In Progress": 55, "in-progress": 55,
  "To Do": 0,        "todo": 0, "pending": 0,
  "Done": 100,       "completed": 100,
  "Overdue": 20,
};

const STATUS_LABELS = {
  "todo": "To Do", "in-progress": "In Progress",
  "completed": "Done", "pending": "To Do",
};

const SORT_MODES = ["Due date", "Priority", "Project"];
const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

const STATIC_TASKS = [
  { _id: "s1", title: "Build auth API endpoints",     project: "Backend API",    dueDate: "2026-05-14", status: "Overdue",     priority: "High"   },
  { _id: "s2", title: "Write onboarding copy",        project: "Marketing",      dueDate: "2026-06-03", status: "To Do",       priority: "Medium" },
  { _id: "s3", title: "Set up component library",     project: "Design System",  dueDate: "2026-05-25", status: "In Progress", priority: "Medium" },
  { _id: "s4", title: "Fix navigation bug on iOS",    project: "Mobile App",     dueDate: "2026-05-12", status: "To Do",       priority: "Low"    },
  { _id: "s5", title: "Create Q2 performance report", project: "Growth",         dueDate: "2026-05-18", status: "Done",        priority: "Low"    },
  { _id: "s6", title: "Integrate Stripe payments",    project: "Backend API",    dueDate: "2026-06-10", status: "To Do",       priority: "High"   },
];

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeStatus(s = "") {
  const map = { "todo": "To Do", "in-progress": "In Progress", "completed": "Done", "pending": "To Do" };
  return map[s.toLowerCase()] || s;
}

// ── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, iconBg, iconColor, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm flex-1">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={26} className={iconColor} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-4xl font-bold text-gray-900 leading-tight">{value ?? 0}</p>
      </div>
    </div>
  );
}

// ── Add Task Modal ───────────────────────────────────────────────────────────

function AddTaskModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ title: "", project: "", dueDate: "", priority: "Medium", status: "To Do" });
  const [saving, setSaving] = useState(false);
  const nameRef = useRef();

  useEffect(() => { if (open) setTimeout(() => nameRef.current?.focus(), 50); }, [open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title.trim()) { nameRef.current?.focus(); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({
          title: form.title,
          project: form.project || "General",
          dueDate: form.dueDate || null,
          priority: form.priority,
          status: form.status === "To Do" ? "todo" : form.status === "In Progress" ? "in-progress" : form.status === "Done" ? "completed" : "todo",
        }),
      });
      const data = await res.json();
      onAdd({ ...data, priority: form.priority });
    } catch {
      // fallback: add locally
      onAdd({ ...form, _id: "local-" + Date.now(), project: form.project || "General" });
    } finally {
      setSaving(false);
      setForm({ title: "", project: "", dueDate: "", priority: "Medium", status: "To Do" });
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">New Task</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Task name *</label>
            <input
              ref={nameRef}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="e.g. Design landing page"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Project</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="e.g. Website Redesign"
              value={form.project}
              onChange={e => set("project", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Due Date</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              value={form.dueDate}
              onChange={e => set("dueDate", e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Priority</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                value={form.priority}
                onChange={e => set("priority", e.target.value)}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Status</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                value={form.status}
                onChange={e => set("status", e.target.value)}
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {saving ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [checked, setChecked]     = useState(new Set());
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery]         = useState("");
  const [sortIdx, setSortIdx]     = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
          headers: { Authorization: token },
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        const backendTasks = data.map(t => ({
          ...t,
          priority: t.priority || "Medium",
          displayStatus: normalizeStatus(t.status),
        }));
        setTasks([...backendTasks, ...STATIC_TASKS.map(t => ({ ...t, displayStatus: t.status }))]);
      } catch {
        setTasks(STATIC_TASKS.map(t => ({ ...t, displayStatus: t.status })));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getDisplayStatus = (task) => task.displayStatus || normalizeStatus(task.status);

  const tabCount = (tab) =>
    tab === "All" ? tasks.length : tasks.filter(t => getDisplayStatus(t) === tab).length;

  const filtered = (() => {
    let list = tasks.filter(t => {
      const ds = getDisplayStatus(t);
      if (activeTab !== "All" && ds !== activeTab) return false;
      if (query) {
        const q = query.toLowerCase();
        const name = (t.title || t.name || "").toLowerCase();
        const proj = (t.project || t.projectId?.name || "").toLowerCase();
        if (!name.includes(q) && !proj.includes(q)) return false;
      }
      return true;
    });
    if (sortIdx === 1) list = [...list].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1));
    if (sortIdx === 2) list = [...list].sort((a, b) => (a.project || "").localeCompare(b.project || ""));
    return list;
  })();

  const stats = {
    total:   tasks.length,
    done:    tasks.filter(t => getDisplayStatus(t) === "Done").length,
    inprog:  tasks.filter(t => getDisplayStatus(t) === "In Progress").length,
    overdue: tasks.filter(t => getDisplayStatus(t) === "Overdue").length,
  };

  const toggleCheck = (id) => setChecked(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const addTask = (task) => {
    const ds = normalizeStatus(task.status);
    setTasks(prev => [{ ...task, displayStatus: ds }, ...prev]);
  };

  const doDelete = () => {
    setTasks(prev => prev.filter(t => t._id !== deleteId));
    setDeleteId(null);
  };

  if (loading) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading tasks...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-sm text-gray-400 mt-0.5">Track, manage and crush your work</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-sm shadow-blue-200"
            >
              <Plus size={15} /> New Task
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* Stat Cards */}
          <div className="flex gap-4">
            <StatCard icon={CheckSquare} iconBg="bg-blue-50"    iconColor="text-blue-500"    label="Total Tasks"  value={stats.total} />
            <StatCard icon={CheckCircle2} iconBg="bg-green-50"  iconColor="text-green-500"   label="Completed"    value={stats.done} />
            <StatCard icon={Clock}        iconBg="bg-yellow-50" iconColor="text-yellow-500"  label="In Progress"  value={stats.inprog} />
            <StatCard icon={AlertCircle}  iconBg="bg-red-50"    iconColor="text-red-500"     label="Overdue"      value={stats.overdue} />
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  <span className={`text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                    activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {tabCount(tab)}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <button
              onClick={() => setSortIdx(i => (i + 1) % SORT_MODES.length)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition"
            >
              <ArrowUpDown size={13} /> {SORT_MODES[sortIdx]}
            </button>

            <p className="ml-auto text-xs text-gray-400">
              Showing {filtered.length} of {tasks.length} tasks
            </p>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["", "Task Name", "Project", "Due Date", "Priority", "Status", "Progress", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-gray-400">
                      <CheckCircle2 size={36} className="mx-auto mb-2 text-gray-200" />
                      <p className="text-sm font-medium text-gray-500">No tasks found</p>
                      <p className="text-xs mt-1">Try adjusting your search or filter</p>
                    </td>
                  </tr>
                ) : filtered.map((task) => {
                  const isDone     = checked.has(task._id);
                  const ds         = getDisplayStatus(task);
                  const progress   = STATUS_PROGRESS[task.status] ?? STATUS_PROGRESS[ds] ?? 0;
                  const pStyle     = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.Medium;
                  const sStyle     = STATUS_STYLE[task.status] || STATUS_STYLE[ds] || STATUS_STYLE["To Do"];
                  const taskName   = task.title || task.name || "—";
                  const project    = task.project || task.projectId?.name || "—";

                  return (
                    <tr
                      key={task._id}
                      className="border-b border-gray-50 hover:bg-gray-50/60 transition group"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleCheck(task._id)}
                          className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                        />
                      </td>

                      {/* Task Name */}
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px]">
                        <span className={isDone ? "line-through text-gray-400" : ""}>{taskName}</span>
                      </td>

                      {/* Project */}
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{project}</td>

                      {/* Due Date */}
                      <td className={`px-4 py-3 whitespace-nowrap text-sm ${ds === "Overdue" ? "text-red-500 font-medium" : "text-gray-500"}`}>
                        {formatDate(task.dueDate || task.due)}
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pStyle.cls}`}>
                          {task.priority || "Medium"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sStyle.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sStyle.dot}`} />
                          {ds}
                        </span>
                      </td>

                      {/* Progress */}
                      <td className="px-4 py-3 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-1.5 bg-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{progress}%</span>
                        </div>
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setDeleteId(task._id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addTask} />

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-2">Delete task?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={doDelete} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}