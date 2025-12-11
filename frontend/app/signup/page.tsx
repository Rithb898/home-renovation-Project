import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Signup() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE: Form */}
      <div className="order-2 flex w-full items-center justify-center p-8 sm:p-12 lg:order-1 lg:w-1/2 lg:p-24">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-block text-2xl font-extrabold tracking-tight text-slate-900 transition-opacity hover:opacity-80"
          >
            Huelip<span className="text-red-600">.</span>
          </Link>

          <h1 className="mb-2 text-3xl font-extrabold text-slate-900">
            Create Account
          </h1>
          <p className="mb-8 text-slate-500">
            Join Huelip to track your renovation progress and manage invoices.
          </p>

          <form className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 transition-all focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 transition-all focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Create Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 transition-all focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to Huelip's{" "}
                <a href="#" className="text-red-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-red-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              className="w-full transform rounded-full bg-red-600 py-4 font-bold text-white shadow-lg shadow-red-200 transition-all duration-200 hover:bg-red-500 hover:shadow-red-300 active:scale-[0.98]"
            >
              Create Account
            </button>
          </form>

          <p className="mt-10 text-center text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-red-600 hover:text-red-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Image (Hidden on mobile) */}
      <div className="relative order-1 hidden w-1/2 bg-slate-50 lg:order-2 lg:block">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2906&auto=format&fit=crop"
          alt="Modern bright kitchen"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-red-900/40 to-transparent" />
        <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform px-12 text-center">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-2 text-2xl font-bold text-white">
              Build Better.
            </h3>
            <p className="text-white/90">
              Join 2,000+ homeowners managing their renovations with Huelip.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
