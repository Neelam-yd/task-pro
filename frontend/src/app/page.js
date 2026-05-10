"use client";

import React from "react";
import Link from "next/link";
import {
  X, CheckCircle, Users, BarChart2, ShieldCheck, Zap, Wifi,
  ArrowRight, ChevronRight, Layout, UserPlus, FolderPlus,
  ListChecks, BadgeCheck, GitBranch,
} from "lucide-react";
import { useState } from "react";
/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [myTasks, setMyTasks] = useState([]);
  const navItems = [
    { name: "Features", link: "#features" },
    { name: "How It Works", link: "#howitworks" },
    
    { name: "Contact", link: "#features" },
  ];

  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-[100] relative">
        <div className="absolute top-0 left-0 right-0 pointer-events-none">
          <div className="max-w-[1290px] mx-auto h-[50px] backdrop-blur-lg bg-white/30 rounded-2xl" />
        </div>
        <div className="relative px-2 md:px-4 py-2">
          <div className="w-full md:max-w-[1290px] md:mx-auto flex items-center justify-between px-4 md:px-5 py-3
            bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-xl md:rounded-2xl
            shadow-[0_4px_24px_rgba(37,99,235,0.07)]
            hover:shadow-[0_8px_40px_rgba(37,99,235,0.12)]
            transition-all duration-300">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow shadow-blue-200">
                <CheckCircle size={14} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[17px] font-bold text-slate-800 tracking-tight">
                Task<span className="text-blue-600">Flow</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
  key={item.name}
  href={item.link}
  className="relative text-[13.5px] font-medium text-slate-600 px-3 py-1.5 rounded-lg cursor-pointer hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
>
  {item.name}
</Link>
              ))}
            </nav>

            {/* Right */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="px-4 py-1.5 text-[13.5px] font-medium text-slate-600 hover:text-blue-700 transition">
                Log In
              </Link>
              <Link href="/register"
                className="px-4 py-2 text-[13.5px] font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow shadow-blue-200 inline-block">
                Get Started
              </Link>
            </div>

            {/* Mobile toggle */}
            <button className="flex md:hidden flex-col gap-[5px]" onClick={() => setOpen(!open)}>
              <span className="w-5 h-[2px] bg-gradient-to-r from-blue-600 to-blue-400 rounded" />
              <span className="w-5 h-[2px] bg-gradient-to-r from-blue-600 to-blue-400 rounded" />
              <span className="w-5 h-[2px] bg-gradient-to-r from-blue-600 to-blue-400 rounded" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-lg px-5 py-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle size={14} className="text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800">Task<span className="text-blue-600">Flow</span></span>
            </div>
            <button onClick={() => setOpen(false)}><X size={24} className="text-slate-500" /></button>
          </div>
          <nav className="mb-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.link} onClick={() => setOpen(false)}>
                <span className="block text-[16px] font-medium text-slate-700 py-3 border-b border-slate-100 hover:text-blue-600 transition">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          <div className="flex gap-3">
            <Link href="/login" className="flex-1 block py-2.5 border border-slate-300 rounded-lg text-slate-600 text-center text-sm font-medium">Log In</Link>
            <Link href="/register" className="flex-1 block py-2.5 rounded-lg text-white bg-blue-600 text-center text-sm font-semibold">Get Started</Link>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero() {
  return (
    <section className="bg-white pt-16 pb-7 px-6">
      <div className="max-w-[1290px] mx-auto">

      

        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-[64px] font-black text-slate-900 leading-[1.08] tracking-tight">
            Manage Projects &<br />
            Teams <span className="text-blue-600">Faster</span>
          </h1>
          <p className="mt-5 text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            TaskFlow is a powerful project management platform. Plan sprints, track issues, collaborate with your team and ship products efficiently.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <Link href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-md shadow-blue-200 hover:bg-white hover:text-blue-700 transition">
            Get Started Free <ArrowRight size={15} />
          </Link>
          
        </div>

       

       

          
         
        </div>
   
    </section>
  );
}


/* ══════════════════════════════════════════
   FEATURES
══════════════════════════════════════════ */
const featuresList = [
  { icon: GitBranch, title: "Sprint Planning", desc: "Plan and manage sprints with ease. Keep your team focused and always on track." },
  { icon: Users, title: "Team Collaboration", desc: "Add members and roles. Collaborate in real-time on any project effortlessly." },
  { icon: BarChart2, title: "Analytics Dashboard", desc: "Insightful reports to track progress and identify blockers fast." },
  { icon: ShieldCheck, title: "Role-Based Access", desc: "Control who sees and edits what across every project and team." },
  { icon: Zap, title: "Real-Time Updates", desc: "See changes instantly. Everyone stays on the same page, always." },
  { icon: Wifi, title: "Secure & Reliable", desc: "Enterprise-grade security with 99.9% uptime across all projects." },
];

function Features() {
  return (
    <section id="features" className="bg-slate-50 border-t border-slate-100 py-17 px-6">
      <div className="max-w-[1290px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-slate-900 mb-3">
            Powerful features to supercharge your teams
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Everything you need to plan, track, and deliver work — built for teams of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuresList.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-[0_4px_24px_rgba(37,99,235,0.09)] transition-all duration-300 group cursor-default">
              <div className="w-11 h-11 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mb-4 transition">
                <Icon size={20} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1.5">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════ */
const steps = [
  { n: "1", Icon: Layout, title: "Create Workspace", desc: "Sign up and create your workspace in minutes." },
  { n: "2", Icon: UserPlus, title: "Add Team Members", desc: "Invite your team and assign roles instantly." },
  { n: "3", Icon: FolderPlus, title: "Create Projects", desc: "Set up projects and organise your work clearly." },
  { n: "4", Icon: ListChecks, title: "Track Issues", desc: "Add tasks, set priorities and deadlines easily." },
  { n: "5", Icon: BadgeCheck, title: "Complete Sprint", desc: "Review, validate and celebrate your team's wins." },
];

function HowItWorks() {
  return (
    <section id="howitworks" className="bg-white border-t border-slate-100 py-20 px-6">
      <div className="max-w-[1290px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-slate-900 mb-2">How it works</h2>
          <p className="text-slate-500 text-sm">Five simple steps to shipping better work, faster.</p>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-4 relative">
          {/* dashed line */}
          <div className="hidden md:block absolute top-[22px] left-[8%] right-[8%] border-t-2 border-dashed border-blue-200 z-0" />

          {steps.map(({ n, Icon, title, desc }) => (
            <div key={n} className="flex-1 flex flex-col items-center text-center relative z-10 px-2">
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-base mb-4 shadow-md shadow-blue-200">
                {n}
              </div>
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                <Icon size={18} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CTA BANNER
══════════════════════════════════════════ */
function CTABanner() {
  return (
    <section className="bg-slate-50  py-16 px-6">
      <div className="max-w-[680px] mx-auto text-center">
        <h2 className="text-3xl font-black text-black mb-2">Ready to streamline your workflow?</h2>
        <p className="text-grey-300 text-sm mb-8 leading-relaxed">
          Join thousands of teams who are already building better products.
        </p>
        <Link href="/register"
          className="inline-flex items-center gap-2 hover:bg-white hover:text-blue-700 font-bold px-8 py-3.5 rounded-xl text-sm bg-blue-500 text-white transition shadow-xl shadow-blue-800/20">
          Start Managing Projects <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-blue-800 px-6 pt-14 pb-8">
      <div className="max-w-[1100px] max-h-[150px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <CheckCircle size={12} className="text-white" />
              </div>
              <span className="text-white font-bold text-base">Task<span className="text-blue-400">Flow</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-5">A modern project management tool built for agile teams.</p>
            
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5">
              {["Features", "Pricing", "Changelog"].map((l) => (
                <li key={l}><Link href="#" className="text-slate-400 text-xs hover:text-white transition">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {["Documentation", "API Reference", "Blog"].map((l) => (
                <li key={l}><Link href="#" className="text-slate-400 text-xs hover:text-white transition">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About", "Careers", "Contact", "Privacy Policy"].map((l) => (
                <li key={l}><Link href="#" className="text-slate-400 text-xs hover:text-white transition">{l}</Link></li>
              ))}
            </ul>
          </div>

        
        </div>

       
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   PAGE EXPORT
══════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      <Features />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </div>
  );
}