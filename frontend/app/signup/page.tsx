import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Signup() {
  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 order-2 lg:order-1">
        <div className="w-full max-w-md">
          
          <Link href="/" className="inline-block mb-10 text-2xl font-extrabold text-slate-900 tracking-tight hover:opacity-80 transition-opacity">
            Huelip<span className="text-red-600">.</span>
          </Link>
          
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500 mb-8">Join Huelip to track your renovation progress and manage invoices.</p>

          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input 
                type="text" 
                id="name"
                placeholder="John Doe" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-700"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                id="email"
                placeholder="you@example.com" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-700"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Create Password</label>
              <input 
                type="password" 
                id="password"
                placeholder="At least 8 characters" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-700"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to Huelip's <a href="#" className="text-red-600 hover:underline">Terms of Service</a> and <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full shadow-lg shadow-red-200 hover:shadow-red-300 transform active:scale-[0.98] transition-all duration-200">
              Create Account
            </button>
          </form>

          <p className="mt-10 text-center text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-red-600 hover:text-red-700">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Image (Hidden on mobile) */}
      <div className="hidden lg:block w-1/2 relative bg-slate-50 order-1 lg:order-2">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2906&auto=format&fit=crop"
          alt="Modern bright kitchen"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-red-900/40 to-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-12">
           <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
             <h3 className="text-2xl font-bold text-white mb-2">Build Better.</h3>
             <p className="text-white/90">Join 2,000+ homeowners managing their renovations with Huelip.</p>
           </div>
        </div>
      </div>
    </div>
  );
}