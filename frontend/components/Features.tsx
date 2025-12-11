import React from 'react';

const Features = () => {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Built on Trust, <br /><span className="text-red-500">Finished with Pride.</span></h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              We don't just renovate houses; we build relationships. Our transparent process ensures you are never in the dark about costs or timelines.
            </p>
            
            <ul className="space-y-4">
              {[
                "Fixed-Price Contracts (No Surprises)",
                "Licensed, Bonded & Insured Team",
                "5-Year Craftsmanship Warranty",
                "Dedicated Project Manager"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-red-500/50 transition-colors">
              <p className="text-4xl font-bold text-white mb-1">10+</p>
              <p className="text-slate-400 text-sm">Years Experience</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-red-500/50 transition-colors mt-8">
              <p className="text-4xl font-bold text-white mb-1">100%</p>
              <p className="text-slate-400 text-sm">On-Time Completion</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-red-500/50 transition-colors">
              <p className="text-4xl font-bold text-white mb-1">50+</p>
              <p className="text-slate-400 text-sm">Design Awards</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-red-500/50 transition-colors mt-8">
              <p className="text-4xl font-bold text-white mb-1">24/7</p>
              <p className="text-slate-400 text-sm">Support Team</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;