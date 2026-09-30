import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Layout, Database, ShoppingCart, Zap, Globe, Briefcase, Monitor, Settings, X, Loader2 } from 'lucide-react';
import { submitInquiry } from '../services/contactService';
import { PackageContactModal } from './PackageContactModal';
import { DEVELOPER_INFO } from '../data';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const packages = [
  {
    title: "Static Website",
    price: "₹15,000",
    description: "Fast, secure, and beautiful static website for online presence.",
    icon: <Monitor className="w-6 h-6" />,
    color: "from-indigo-500/20 to-indigo-500/5",
    accent: "text-indigo-500",
    features: [
      "Up to 3 static pages",
      "Mobile responsive design",
      "Fast load times",
      "Basic contact form",
      "1 Month free support"
    ]
  },
  {
    title: "Basic",
    price: "₹25,000",
    description: "Dynamic 5-page website perfect for small businesses.",
    icon: <Layout className="w-6 h-6" />,
    color: "from-blue-500/20 to-blue-500/5",
    accent: "text-blue-500",
    features: [
      "Dynamic 5-page website",
      "Mobile responsive design",
      "Basic SEO setup",
      "Contact form integration",
      "1 Month free support"
    ]
  },
  {
    title: "Platform Based",
    price: "₹25,000",
    description: "Fast, CMS-driven website development using top platforms.",
    icon: <Globe className="w-6 h-6" />,
    color: "from-pink-500/20 to-pink-500/5",
    accent: "text-pink-500",
    features: [
      "CMS driven website",
      "Theme/Template customization",
      "Fast deployment",
      "Easy content management",
      "Responsive design"
    ]
  },
  {
    title: "Backend Services",
    price: "₹30,000",
    description: "API development, data pipelines, and third-party system connectors.",
    icon: <Database className="w-6 h-6" />,
    color: "from-emerald-500/20 to-emerald-500/5",
    accent: "text-emerald-500",
    features: [
      "Custom API development",
      "System Connectors (Shopify, Odoo, etc.)",
      "Automated Data Pipelines",
      "Email-to-ERP automation",
      "Robust backend infrastructure"
    ]
  },
  {
    title: "High-End",
    price: "₹40,000",
    description: "Detailed, custom-designed website with advanced animations.",
    icon: <Zap className="w-6 h-6" />,
    color: "from-purple-500/20 to-purple-500/5",
    accent: "text-purple-500",
    features: [
      "Custom premium design",
      "Advanced animations & GSAP",
      "Unlimited pages",
      "CMS integration",
      "Performance optimization"
    ],
    isPopular: true
  },
  {
    title: "E-Commerce",
    price: "₹40,000",
    description: "Full-fledged online store with payment gateway integration.",
    icon: <ShoppingCart className="w-6 h-6" />,
    color: "from-amber-500/20 to-amber-500/5",
    accent: "text-amber-500",
    features: [
      "Complete online store",
      "Payment gateway integration",
      "Product & Inventory management",
      "Admin dashboard",
      "Order tracking system"
    ]
  },
  {
    title: "ERP Softwares",
    price: "₹50,000",
    description: "Custom Enterprise Resource Planning solutions for scale.",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-cyan-500/20 to-cyan-500/5",
    accent: "text-cyan-500",
    features: [
      "Custom business logic",
      "Employee & resource management",
      "Data analytics dashboard",
      "Secure role-based access",
      "Process automation"
    ]
  },
  {
    title: "Custom Work",
    price: "Custom",
    description: "Tailored solutions based on your specific requirements and needs.",
    icon: <Settings className="w-6 h-6" />,
    color: "from-rose-500/20 to-rose-500/5",
    accent: "text-rose-500",
    features: [
      "Custom feature development",
      "Third-party integrations",
      "UI/UX design & revamps",
      "Consulting & architecture",
      "Dedicated developer hours"
    ]
  }
];

export const Packages = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);

  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  useGSAP(() => {
    gsap.fromTo(titleGroupRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleGroupRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        }
      }
    );

    if (cardsRef.current) {
      gsap.fromTo(cardsRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          }
        }
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="packages" className="relative overflow-hidden bg-transparent py-24 md:py-32 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div ref={titleGroupRef} className="mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-pastel-1/70 dark:bg-white/5 border border-pastel-4 dark:border-white/10">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400">Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-semibold text-slate-900 dark:text-white mb-4">
            Services & Packages
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 max-w-2xl text-sm md:text-base">
            Choose the right package for your next project. From simple dynamic sites to robust e-commerce platforms, we have you covered.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {packages.map((pkg, idx) => (
            <div 
              key={idx}
              className={`relative flex flex-col p-6 md:p-8 bg-white/35 dark:bg-white/2 border ${pkg.isPopular ? 'border-purple-500/50 dark:border-purple-500/50' : 'border-slate-200/80 dark:border-white/10'} rounded-3xl overflow-hidden shadow-lg dark:shadow-none backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-linear-to-b ${pkg.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
              
              {pkg.isPopular && (
                <div className="absolute top-0 right-6 bg-purple-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-b-lg shadow-sm">
                  Popular
                </div>
              )}

              <div className="relative z-10 flex-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 ${pkg.accent} shadow-sm`}>
                  {pkg.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{pkg.title}</h3>
                <p className="text-sm text-slate-500 dark:text-neutral-400 mb-6 min-h-10">{pkg.description}</p>
                
                <div className="mb-8">
                  <span className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">Starting from</span>
                  <div className="text-3xl font-poppins font-bold text-slate-900 dark:text-white mt-1">
                    {pkg.price}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-neutral-300">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${pkg.accent}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-auto pt-6 border-t border-slate-200/50 dark:border-white/5">
                <button 
                  onClick={() => setSelectedPkg(pkg.title)}
                  className={`block w-full py-3 px-4 rounded-xl text-center font-bold text-sm transition-colors cursor-pointer ${pkg.isPopular ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-md' : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-100 shadow-sm'}`}
                >
                  Contact to start
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Disclaimer */}
        <div className="mt-12 md:mt-16 text-center lg:text-left">
          <p className="text-xs md:text-sm text-slate-500 dark:text-neutral-500 italic flex items-center lg:justify-start justify-center gap-2">
            <span className="text-red-400">*</span> Note: Prices may increase or decrease based on your specific requirements and scope of work.
          </p>
        </div>

        {/* Dynamic Contact Form Modal */}
        {selectedPkg && (
          <PackageContactModal 
            selectedPkg={selectedPkg} 
            onClose={() => setSelectedPkg(null)} 
          />
        )}

      </div>
    </section>
  );
};
