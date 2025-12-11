import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    <section className="relative w-full bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 min-h-[90vh] py-12 lg:py-0">
          
          {/* 1. Text Content (Left Side) */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-10">
            
            {/* Badge */}
            <span className="inline-block py-1 px-3 rounded-full bg-red-50 text-red-600 font-bold text-xs tracking-wider uppercase mb-6 border border-red-100">
              Licensed & Insured
            </span>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Love your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-500">
                home again.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              {subtitle}
            </p>

            {/* Buttons - "Rad" Style (Red + Rounded) */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/contact"
                className="group relative px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-full shadow-xl shadow-red-200 hover:shadow-2xl hover:shadow-red-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {primaryCtaText}
                {/* Arrow Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>

              <Link 
                href="/projects"
                className="px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-full border-2 border-slate-200 hover:border-red-600 hover:text-red-600 transition-colors duration-300 flex items-center justify-center"
              >
                {secondaryCtaText}
              </Link>
            </div>

            {/* Social Proof / Stats */}
            <div className="mt-12 flex items-center gap-8 pt-8 border-t border-slate-100 w-full">
                <div>
                    <p className="text-3xl font-bold text-slate-900">150+</p>
                    <p className="text-sm text-slate-500 font-medium">Projects Completed</p>
                </div>
                <div className="h-10 w-px bg-slate-200"></div>
                <div>
                    <p className="text-3xl font-bold text-slate-900">4.9</p>
                    <p className="text-sm text-slate-500 font-medium">Average Rating</p>
                </div>
            </div>
          </div>

          {/* 2. Image Content (Right Side) */}
          <div className="w-full lg:w-1/2 h-[400px] sm:h-[500px] lg:h-[700px] relative">
            
            {/* Decorative colored blob behind image */}
            <div className="absolute top-10 right-10 w-[80%] h-[80%] bg-red-100 rounded-[3rem] -z-10 transform rotate-3"></div>

            {/* Main Image */}
            <div className="relative w-full h-full rounded-4xl overflow-hidden shadow-2xl shadow-slate-200/50">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop"
                alt="Bright modern kitchen renovation"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Floating Card Detail */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-50 hidden lg:block animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Status</p>
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