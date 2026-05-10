'use client';

import { useState } from 'react';
import {
  Search, UserPlus, Mail, MoreHorizontal, Shield,
  Users, Crown, Code2, TestTube2, Briefcase,
  CheckCircle2, XCircle, ChevronDown, X, Bell
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

// ── Data ─────────────────────────────────────────────────────────────────────

const MEMBERS = [
  { id: 1,  name: 'Alex Smith',    email: 'alex@example.com',   role: 'Admin',           projects: 5, status: 'Active',   initials: 'AS', avatarBg: 'bg-blue-500' },
  { id: 2,  name: 'Sarah Wilson',  email: 'sarah@example.com',  role: 'Project Manager', projects: 4, status: 'Active',   initials: 'SW', avatarBg: 'bg-violet-500' },
  { id: 3,  name: 'Mike Johnson',  email: 'mike@example.com',   role: 'Developer',       projects: 5, status: 'Active',   initials: 'MJ', avatarBg: 'bg-emerald-500' },
  { id: 4,  name: 'John Doe',      email: 'john@example.com',   role: 'Developer',       projects: 3, status: 'Active',   initials: 'JD', avatarBg: 'bg-amber-500' },
  { id: 5,  name: 'Emily Davis',   email: 'emily@example.com',  role: 'QA Engineer',     projects: 2, status: 'Inactive', initials: 'ED', avatarBg: 'bg-rose-400' },
  { id: 6,  name: 'Priya Sharma',  email: 'priya@example.com',  role: 'Developer',       projects: 4, status: 'Active',   initials: 'PS', avatarBg: 'bg-pink-500' },
  { id: 7,  name: 'Rahul Mehta',   email: 'rahul@example.com',  role: 'Project Manager', projects: 3, status: 'Active',   initials: 'RM', avatarBg: 'bg-cyan-500' },
  { id: 8,  name: 'Sneha Patel',   email: 'sneha@example.com',  role: 'QA Engineer',     projects: 2, status: 'Inactive', initials: 'SP', avatarBg: 'bg-orange-400' },
];

const ROLES = [
  {
    role: 'Admin',
    icon: Crown,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    description: 'Full access to all settings, members, projects and billing.',
    permissions: ['Manage members', 'Create & delete projects', 'Billing access', 'View all reports', 'Manage roles'],
  },
  {
    role: 'Project Manager',
    icon: Briefcase,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description: 'Can create and manage projects, assign tasks and oversee team progress.',
    permissions: ['Create & manage projects', 'Assign tasks', 'View reports', 'Invite members'],
  },
  {
    role: 'Developer',
    icon: Code2,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    description: 'Can view and work on assigned projects and tasks.',
    permissions: ['View assigned projects', 'Update task status', 'Comment on tasks', 'Upload files'],
  },
  {
    role: 'QA Engineer',
    icon: TestTube2,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    description: 'Can review, test and report issues on projects they are assigned to.',
    permissions: ['View assigned projects', 'Report bugs', 'Update task status', 'Comment on tasks'],
  },
];

const ROLE_BADGE = {
  'Admin':           'bg-purple-50 text-purple-700 border border-purple-200',
  'Project Manager': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Developer':       'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'QA Engineer':     'bg-amber-50 text-amber-700 border border-amber-200',
};

// ── Invite Modal ──────────────────────────────────────────────────────────────

function InviteModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'Developer' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Invite Team Member</h2>
            <p className="text-xs text-gray-400 mt-0.5">They'll receive an email to join your workspace</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="e.g. John Smith"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="john@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Role</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
              value={form.role}
              onChange={e => set('role', e.target.value)}
            >
              <option>Admin</option>
              <option>Project Manager</option>
              <option>Developer</option>
              <option>QA Engineer</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <UserPlus size={15} /> Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [activeTab, setActiveTab]   = useState('Members');
  const [search, setSearch]         = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [openMenu, setOpenMenu]     = useState(null);

  const filtered = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount   = MEMBERS.filter(m => m.status === 'Active').length;
  const inactiveCount = MEMBERS.filter(m => m.status === 'Inactive').length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team</h1>
            <p className="text-sm text-gray-400 mt-0.5">{MEMBERS.length} members · {activeCount} active</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search members..."
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <button
              onClick={() => setShowInvite(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-sm shadow-blue-200"
            >
              <UserPlus size={15} /> Invite Member
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* Stat Cards */}
          <div className="flex gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm flex-1">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Users size={26} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Members</p>
                <p className="text-4xl font-bold text-gray-900 leading-tight">{MEMBERS.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">In your workspace</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm flex-1">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 size={26} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Active</p>
                <p className="text-4xl font-bold text-gray-900 leading-tight">{activeCount}</p>
                <p className="text-xs text-gray-400 mt-0.5">Currently active</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm flex-1">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <XCircle size={26} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Inactive</p>
                <p className="text-4xl font-bold text-gray-900 leading-tight">{inactiveCount}</p>
                <p className="text-xs text-gray-400 mt-0.5">Awaiting access</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm flex-1">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                <Shield size={26} className="text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Roles</p>
                <p className="text-4xl font-bold text-gray-900 leading-tight">{ROLES.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">Permission levels</p>
              </div>
            </div>
          </div>

          {/* Tab Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-100 px-6 pt-1">
              {['Members', 'Roles & Permissions'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3.5 text-sm font-medium border-b-2 -mb-px transition ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Members Tab */}
            {activeTab === 'Members' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Member</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Projects</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                        <Users size={36} className="mx-auto mb-2 text-gray-200" />
                        <p className="text-sm font-medium text-gray-500">No members found</p>
                      </td>
                    </tr>
                  ) : filtered.map(member => (
                    <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition group">

                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 ${member.avatarBg} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {member.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <Mail size={13} className="text-gray-300 shrink-0" />
                          {member.email}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_BADGE[member.role] || 'bg-gray-100 text-gray-600'}`}>
                          {member.role}
                        </span>
                      </td>

                      {/* Projects */}
                      <td className="px-4 py-4">
                        <span className="text-gray-700 font-semibold text-sm">{member.projects}</span>
                        <span className="text-gray-400 text-xs ml-1">projects</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          member.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {member.status}
                        </span>
                      </td>

                      {/* Menu */}
                      <td className="px-4 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 transition"
                          >
                            <MoreHorizontal size={15} className="text-gray-400" />
                          </button>
                          {openMenu === member.id && (
                            <div className="absolute right-0 top-8 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-36">
                              <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition">Edit role</button>
                              <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition">Send message</button>
                              <button className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition">Remove</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Roles & Permissions Tab */}
            {activeTab === 'Roles & Permissions' && (
              <div className="p-6 grid grid-cols-2 gap-4">
                {ROLES.map(({ role, icon: Icon, iconBg, iconColor, description, permissions }) => (
                  <div key={role} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon size={20} className={iconColor} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{role}</p>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[role]}`}>
                          {MEMBERS.filter(m => m.role === role).length} member{MEMBERS.filter(m => m.role === role).length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{description}</p>

                    <div className="space-y-1.5">
                      {permissions.map(p => (
                        <div key={p} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Invite Modal */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      {/* Close menu on outside click */}
      {openMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
      )}
    </div>
  );
}