'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, ChevronDown, Zap } from 'lucide-react';

export default function SignUpPage() {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [role, setRole] = useState('');

  // 🔥 REQUIRED STATES (ADDED)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const roles = [
     'member',
    'admin',
    
  ];

  // 🔥 SIGNUP FUNCTION
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      alert("Signup successful! Please login.");

      // redirect to login
      router.push("/login");

    } catch (error) {
      console.log(error);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold text-blue-900">TaskFlow</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-50 p-8">

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create your account 🚀
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Get started with TaskFlow
          </p>

          <form className="space-y-4" onSubmit={handleSignup}>

            {/* NAME */}
            <div>
              <label className="text-sm">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 py-2 border rounded-lg text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 py-2 border rounded-lg text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* ROLE */}
            <div>
              <label className="text-sm">Role</label>
              <div className="relative mt-1">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="">Select role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg text-sm"
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* TERMS */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
              />
              <span className="text-sm text-gray-600">
                I agree to Terms & Conditions
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={!agreed}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>

          <p className="text-center text-sm mt-4 text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}