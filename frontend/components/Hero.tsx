import React from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Renovations done right.",
  subtitle = "Huelip transforms outdated spaces into modern sanctuaries. Expert craftsmanship, transparent pricing, and a timeline you can actually trust.",
  primaryCtaText = "Get Free Quote",
  secondaryCtaText = "See Our Work",
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[90vh] flex-col-reverse items-center gap-12 py-12 lg:flex-row lg:gap-20 lg:py-0">
          {/* 1. Text Content (Left Side) */}
          <div className="z-10 flex w-full flex-col items-start text-left lg:w-1/2">
            {/* Badge */}
            <span className="mb-6 inline-block rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold tracking-wider text-red-600 uppercase">
              Licensed & Insured
            </span>

            {/* Headline */}
            <h1 className="mb-6 text-5xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Love your <br />
              <span className="bg-linear-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                home again.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-600 sm:text-xl">
              {subtitle}
            </p>

            {/* Buttons - "Rad" Style (Red + Rounded) */}
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Link
                href="/contact"
                className="group relative flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-red-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-300"
              >
                {primaryCtaText}
                {/* Arrow Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </Link>

              <Link
                href="/projects"
                className="flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-900 transition-colors duration-300 hover:border-red-600 hover:text-red-600"
              >
                {secondaryCtaText}
              </Link>
            </div>

            {/* Social Proof / Stats */}
            <div className="mt-12 flex w-full items-center gap-8 border-t border-slate-100 pt-8">
              <div>
                <p className="text-3xl font-bold text-slate-900">150+</p>
                <p className="text-sm font-medium text-slate-500">
                  Projects Completed
                </p>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div>
                <p className="text-3xl font-bold text-slate-900">4.9</p>
                <p className="text-sm font-medium text-slate-500">
                  Average Rating
                </p>
              </div>
            </div>
          </div>

          {/* 2. Image Content (Right Side) */}
          <div className="relative h-[400px] w-full sm:h-[500px] lg:h-[700px] lg:w-1/2">
            {/* Decorative colored blob behind image */}
            <div className="absolute top-10 right-10 -z-10 h-[80%] w-[80%] rotate-3 transform rounded-[3rem] bg-red-100"></div>

            {/* Main Image */}
            <div className="relative h-full w-full overflow-hidden rounded-4xl shadow-2xl shadow-slate-200/50">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop"
                alt="Bright modern kitchen renovation"
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Floating Card Detail */}
            <div className="animate-bounce-slow absolute -bottom-6 -left-6 hidden rounded-xl border border-slate-50 bg-white p-4 shadow-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </p>
                  <p className="font-bold text-slate-800">Delivered On Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
