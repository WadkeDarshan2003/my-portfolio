import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { submitInquiry } from '../services/contactService';

interface PackageContactModalProps {
  selectedPkg: string;
  onClose: () => void;
}

export const PackageContactModal: React.FC<PackageContactModalProps> = ({ selectedPkg, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Common Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    message: ''
  });

  // Dynamic Fields
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  const handleCustomFieldChange = (key: string, value: string) => {
    setCustomFields(prev => ({ ...prev, [key]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Save to Firebase Database (Always happens first as backup)
      await submitInquiry({
        ...formData,
        ...customFields,
        packageName: selectedPkg
      });

      // 2. Send email via Web3Forms API
      const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY; 
      
      if (WEB3FORMS_KEY) {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `New Lead: ${selectedPkg} Package Inquiry`,
            from_name: formData.name,
            replyto: formData.email, // This makes hitting "reply" email the client directly!
            email: formData.email,
            phone: formData.phone,
            business: formData.businessName,
            package: selectedPkg,
            ...customFields,
            message: formData.message
          })
        });

        if (!response.ok) {
          throw new Error("Web3Forms API failed");
        }
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitError("Failed to send inquiry. Please check your connection or email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCustomFields = () => {
    switch (selectedPkg) {
      case 'E-Commerce':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Number of Products</label>
              <select 
                value={customFields.productCount || ''}
                onChange={(e) => handleCustomFieldChange('productCount', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white appearance-none"
              >
                <option value="" disabled>Select range</option>
                <option value="1-50">1 - 50</option>
                <option value="51-500">51 - 500</option>
                <option value="500+">500+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Payment Gateway</label>
              <input 
                type="text" 
                value={customFields.paymentGateway || ''}
                onChange={(e) => handleCustomFieldChange('paymentGateway', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
                placeholder="Stripe, Razorpay, etc."
              />
            </div>
          </div>
        );
      
      case 'ERP Softwares':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Company Size</label>
              <select 
                value={customFields.companySize || ''}
                onChange={(e) => handleCustomFieldChange('companySize', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white appearance-none"
              >
                <option value="" disabled>Select size</option>
                <option value="1-10">1 - 10 Employees</option>
                <option value="11-50">11 - 50 Employees</option>
                <option value="51-200">51 - 200 Employees</option>
                <option value="200+">200+ Employees</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Key Modules Needed</label>
              <input 
                type="text" 
                value={customFields.keyModules || ''}
                onChange={(e) => handleCustomFieldChange('keyModules', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
                placeholder="HR, Inventory, Sales..."
              />
            </div>
          </div>
        );

      case 'Backend Services':
        return (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Systems to Connect / Automate</label>
            <input 
              type="text" 
              value={customFields.systemsToConnect || ''}
              onChange={(e) => handleCustomFieldChange('systemsToConnect', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
              placeholder="Shopify, Odoo, Custom ERP..."
            />
          </div>
        );

      case 'Custom Work':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Estimated Budget</label>
              <select 
                value={customFields.budget || ''}
                onChange={(e) => handleCustomFieldChange('budget', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white appearance-none"
              >
                <option value="" disabled>Select budget</option>
                <option value="Under ₹50k">Under ₹50k</option>
                <option value="₹50k - ₹1L">₹50k - ₹1L</option>
                <option value="₹1L - ₹5L">₹1L - ₹5L</option>
                <option value="₹5L+">₹5L+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Project Timeline</label>
              <select 
                value={customFields.timeline || ''}
                onChange={(e) => handleCustomFieldChange('timeline', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white appearance-none"
              >
                <option value="" disabled>Select timeline</option>
                <option value="ASAP (Urgent)">ASAP (Urgent)</option>
                <option value="1-2 Months">1-2 Months</option>
                <option value="3+ Months">3+ Months</option>
              </select>
            </div>
          </div>
        );

      default:
        // For Static, Basic, Platform Based, High-End
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Have a current website?</label>
              <select 
                value={customFields.hasWebsite || ''}
                onChange={(e) => handleCustomFieldChange('hasWebsite', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white appearance-none"
              >
                <option value="" disabled>Select</option>
                <option value="Yes">Yes, needs revamp</option>
                <option value="No">No, starting fresh</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Branding ready?</label>
              <select 
                value={customFields.hasBranding || ''}
                onChange={(e) => handleCustomFieldChange('hasBranding', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white appearance-none"
              >
                <option value="" disabled>Select</option>
                <option value="Yes">Yes (Logo/Colors ready)</option>
                <option value="No">No (Needs design)</option>
              </select>
            </div>
          </div>
        );
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-white/10 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/10 outline-none cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Project Inquiry</h3>
        <p className="text-sm text-slate-500 dark:text-neutral-400 mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
          Requesting details for the <span className="font-bold text-blue-500">{selectedPkg}</span> package.
        </p>

        {submitSuccess ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Received!</h4>
            <p className="text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">
              Thank you for providing the details. I will review your requirements and get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-5">
            {submitError && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="text-red-500 mt-0.5"><X size={18} /></div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Submission Error</h4>
                  <p className="text-xs text-red-600 dark:text-red-300 mt-1">{submitError}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSubmitError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Full Name *</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Business/Company Name</label>
                <input 
                  type="text" 
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
                  placeholder="Acme Corp (Optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Email Address *</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Dynamic Package-Specific Fields */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">Package Requirements</h4>
              {renderCustomFields()}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wide mb-1">Project Details *</label>
              <textarea 
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-slate-900 dark:text-white resize-none"
                placeholder="Tell me about your vision, specific requirements, and any questions you have..."
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-4 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 outline-none disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <><Loader2 size={18} className="animate-spin" /> Submitting Request...</>
              ) : (
                'Submit Inquiry'
              )}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
