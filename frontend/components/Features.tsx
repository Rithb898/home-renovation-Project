import React from "react";

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <h2 className="mb-6 text-3xl font-extrabold sm:text-4xl">
              Built on Trust, <br />
              <span className="text-red-500">Finished with Pride.</span>
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-400">
              We don't just renovate houses; we build relationships. Our
              transparent process ensures you are never in the dark about costs
              or timelines.
            </p>

            <ul className="space-y-4">
              {[
                "Fixed-Price Contracts (No Surprises)",
                "Licensed, Bonded & Insured Team",
                "5-Year Craftsmanship Warranty",
                "Dedicated Project Manager",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 sm:gap-6 lg:w-1/2">
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-red-500/50">
              <p className="mb-1 text-4xl font-bold text-white">10+</p>
              <p className="text-sm text-slate-400">Years Experience</p>
            </div>
            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-red-500/50">
              <p className="mb-1 text-4xl font-bold text-white">100%</p>
              <p className="text-sm text-slate-400">On-Time Completion</p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-red-500/50">
              <p className="mb-1 text-4xl font-bold text-white">50+</p>
              <p className="text-sm text-slate-400">Design Awards</p>
            </div>
            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-red-500/50">
              <p className="mb-1 text-4xl font-bold text-white">24/7</p>
              <p className="text-sm text-slate-400">Support Team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
