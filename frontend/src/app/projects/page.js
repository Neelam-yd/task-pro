'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Grid3X3, List, Clock, Star,
  MoreHorizontal, Folder, CheckCircle2, AlertCircle,
  TrendingUp, Users, X, ChevronDown, Loader2
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

/* ── STATUS CONFIG ─────────────────────────────── */
// Covers all values your backend may return: "active", "completed", "in-progress", "pending"
const statusConfig = {
  'active':      { cls: 'bg-blue-50 text-blue-700 border border-blue-200',         dot: 'bg-blue-500' },
  'in-progress': { cls: 'bg-blue-50 text-blue-700 border border-blue-200',         dot: 'bg-blue-500' },
  'completed':   { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
  'done':        { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
  'pending':     { cls: 'bg-gray-100 text-gray-600 border border-gray-200',         dot: 'bg-gray-400' },
  'in-review':   { cls: 'bg-amber-50 text-amber-700 border border-amber-200',       dot: 'bg-amber-500' },
};

const STATUS_LABELS = {
  'active':      'Active',
  'in-progress': 'In Progress',
  'completed':   'Done',
  'done':        'Done',
  'pending':     'To Do',
  'in-review':   'In Review',
};

/* ── PALETTE for project accent colors ─────────── */
const PALETTES = [
  { bg: 'bg-blue-600',    light: 'bg-blue-50',   bar: 'bg-blue-500',    text: 'text-blue-700' },
  { bg: 'bg-violet-600',  light: 'bg-violet-50',  bar: 'bg-violet-500',  text: 'text-violet-700' },
  { bg: 'bg-emerald-600', light: 'bg-emerald-50', bar: 'bg-emerald-500', text: 'text-emerald-700' },
  { bg: 'bg-rose-600',    light: 'bg-rose-50',    bar: 'bg-rose-500',    text: 'text-rose-700' },
  { bg: 'bg-amber-600',   light: 'bg-amber-50',   bar: 'bg-amber-500',   text: 'text-amber-700' },
  { bg: 'bg-cyan-600',    light: 'bg-cyan-50',    bar: 'bg-cyan-500',    text: 'text-cyan-700' },
  { bg: 'bg-indigo-600',  light: 'bg-indigo-50',  bar: 'bg-indigo-500',  text: 'text-indigo-700' },
  { bg: 'bg-pink-600',    light: 'bg-pink-50',    bar: 'bg-pink-500',    text: 'text-pink-700' },
];

function getPalette(index) {
  return PALETTES[index % PALETTES.length];
}

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(d) {
  if (!d) return 'No due date';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── AVATAR ────────────────────────────────────── */
const avatarBgs = ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-rose-500','bg-amber-500','bg-cyan-500'];
function MemberAvatar({ name, index }) {
  const initials = typeof name === 'string' && name.length <= 3 ? name : getInitials(name);
  return (
    <div
      className={`w-7 h-7 ${avatarBgs[index % avatarBgs.length]} rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white`}
      title={name}
    >
      {initials}
    </div>
  );
}

/* ── STAT PILL ─────────────────────────────────── */
function StatPill({ icon: Icon, value, label, color }) {
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl ${color} flex-1`}>
      <Icon size={18} />
      <div>
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="text-xs opacity-70 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ── PROJECT CARD (Grid view) ──────────────────── */
function ProjectCard({ project, palette, onStar, onEdit }) {
  const status = (project.status || 'pending').toLowerCase();
  const statusLabel = STATUS_LABELS[status] || project.status || 'Active';
  const st = statusConfig[status] || statusConfig['active'];
  const progress = project.progress ?? 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">

      {/* color accent strip */}
      <div className={`h-1.5 w-full ${palette.bar}`} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${palette.bg} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
              {getInitials(project.name)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{project.name}</h3>
              <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full mt-0.5 font-medium ${st.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onStar(project._id)}
              className="p-1 rounded-lg hover:bg-gray-50 transition"
            >
              <Star
                size={15}
                className={project.starred ? 'text-amber-400' : 'text-gray-300 group-hover:text-gray-400'}
                fill={project.starred ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span className="font-medium text-gray-600">Progress</span>
            <span className={`font-semibold ${palette.text}`}>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full ${palette.bar} transition-all duration-700`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex -space-x-2">
            {(project.members || []).slice(0, 4).map((m, i) => (
              <MemberAvatar key={i} name={m} index={i} />
            ))}
            {(project.members || []).length > 4 && (
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600 border-2 border-white">
                +{project.members.length - 4}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={11} />
            <span>{formatDate(project.dueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PROJECT ROW (List view) ───────────────────── */
function ProjectRow({ project, palette, onStar, index }) {
  const status = (project.status || 'pending').toLowerCase();
  const statusLabel = STATUS_LABELS[status] || project.status || 'Active';
  const st = statusConfig[status] || statusConfig['active'];
  const progress = project.progress ?? 0;

  return (
    <div className="group bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-5 hover:shadow-md hover:border-gray-200 transition-all duration-200">
      <div className={`w-9 h-9 ${palette.bg} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
        {getInitials(project.name)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate">{project.name}</p>
        <p className="text-xs text-gray-400 truncate">{project.description || '—'}</p>
      </div>

      <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium shrink-0 flex items-center gap-1 ${st.cls}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
        {statusLabel}
      </span>

      <div className="w-28 shrink-0">
        <div className="flex justify-between text-[11px] text-gray-400 mb-1">
          <span>Progress</span>
          <span className={`font-semibold ${palette.text}`}>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-1.5 rounded-full ${palette.bar}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex -space-x-1.5 shrink-0">
        {(project.members || []).slice(0, 3).map((m, i) => (
          <MemberAvatar key={i} name={m} index={i} />
        ))}
      </div>

      <div className="text-xs text-gray-400 flex items-center gap-1 shrink-0 w-28">
        <Clock size={11} />
        {formatDate(project.dueDate)}
      </div>

      <button
        onClick={() => onStar(project._id)}
        className="p-1 rounded-lg hover:bg-gray-50 transition shrink-0"
      >
        <Star
          size={15}
          className={project.starred ? 'text-amber-400' : 'text-gray-200 group-hover:text-gray-300'}
          fill={project.starred ? 'currentColor' : 'none'}
        />
      </button>
    </div>
  );
}

/* ── NEW PROJECT MODAL ─────────────────────────── */
function NewProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', description: '', dueDate: '', status: 'active' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Project name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to create project.'); return; }
      onCreated(data);
      onClose();
    } catch (e) {
      setError('Network error. Is the server running?');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">New Project</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Project Name *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="e.g. Mobile App Redesign"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              rows={3}
              placeholder="What is this project about?"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Due Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              />
            </div>

            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Status</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                <option value="active">Active</option>
                <option value="pending">To Do</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {saving ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════ */
export default function ProjectsPage() {
  const [projects, setProjects]   = useState([]);
  const [view, setView]           = useState('grid');
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  const [loading, setLoading]     = useState(true);
  const [starred, setStarred]     = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/projects', {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (!res.ok) return;
      setProjects(data);
      const init = {};
      data.forEach(p => { init[p._id] = p.starred || false; });
      setStarred(init);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = (id) => setStarred(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    setStarred(prev => ({ ...prev, [newProject._id]: false }));
  };

  if (loading) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading projects...</p>
        </div>
      </div>
    </div>
  );

  /* derived data */
  const withStars = projects.map((p, i) => ({ ...p, starred: starred[p._id], _paletteIdx: i }));

  const filtered = withStars.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const s = (p.status || '').toLowerCase();
    const matchFilter =
      filter === 'all'         ? true :
      filter === 'starred'     ? p.starred :
      filter === 'active'      ? ['active','in-progress'].includes(s) :
      filter === 'completed'   ? ['completed','done'].includes(s) :
      filter === 'pending'     ? s === 'pending' :
      s === filter;
    return matchSearch && matchFilter;
  });

  const starredProjects  = filtered.filter(p => p.starred);
  const regularProjects  = filtered.filter(p => !p.starred);

  /* stats */
  const total      = projects.length;
  const done       = projects.filter(p => ['completed','done'].includes((p.status||'').toLowerCase())).length;
  const inProgress = projects.filter(p => ['in-progress','active'].includes((p.status||'').toLowerCase())).length;
  const overdue    = projects.filter(p => p.dueDate && new Date(p.dueDate) < new Date() && !['completed','done'].includes((p.status||'').toLowerCase())).length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOP BAR ── */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-400 mt-0.5">{total} project{total !== 1 ? 's' : ''} total</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-lg transition ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid3X3 size={15} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-lg transition ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={15} />
              </button>
            </div>

            {/* New Project */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-sm shadow-blue-200"
            >
              <Plus size={15} /> New Project
            </button>
          </div>
        </header>

        {/* ── SCROLLABLE BODY ── */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* ── STATS ROW ── */}
          <div className="flex gap-4">
            <StatPill icon={Folder}       value={total}      label="Total Projects"  color="bg-blue-50 text-blue-700" />
            <StatPill icon={CheckCircle2} value={done}       label="Completed"       color="bg-emerald-50 text-emerald-700" />
            <StatPill icon={TrendingUp}   value={inProgress} label="In Progress"     color="bg-amber-50 text-amber-700" />
            <StatPill icon={AlertCircle}  value={overdue}    label="Overdue"         color="bg-red-50 text-red-700" />
          </div>

          {/* ── FILTER TABS ── */}
          <div className="flex items-center gap-2">
            {[
              { key: 'all',       label: 'All' },
              { key: 'starred',   label: '⭐ Starred' },
              { key: 'active',    label: 'Active' },
              { key: 'pending',   label: 'To Do' },
              { key: 'completed', label: 'Completed' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── STARRED ── */}
          {starredProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Star size={13} className="text-amber-400" fill="currentColor" /> Starred
              </h2>
              {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {starredProjects.map(p => (
                    <ProjectCard key={p._id} project={p} palette={getPalette(p._paletteIdx)} onStar={toggleStar} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {starredProjects.map(p => (
                    <ProjectRow key={p._id} project={p} palette={getPalette(p._paletteIdx)} onStar={toggleStar} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── ALL / REGULAR PROJECTS ── */}
          <section>
            {starredProjects.length > 0 && (
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                All Projects
              </h2>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Folder size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="font-medium text-gray-500">No projects found</p>
                <p className="text-sm mt-1">Try adjusting your search or filter</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Create your first project
                </button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {regularProjects.map(p => (
                  <ProjectCard key={p._id} project={p} palette={getPalette(p._paletteIdx)} onStar={toggleStar} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {regularProjects.map(p => (
                  <ProjectRow key={p._id} project={p} palette={getPalette(p._paletteIdx)} onStar={toggleStar} />
                ))}
              </div>
            )}
          </section>

        </main>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}