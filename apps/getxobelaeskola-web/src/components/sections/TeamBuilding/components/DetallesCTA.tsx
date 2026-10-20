'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { stagger, revealUp } from '../../../../lib/corporateMotion';

export default function DetallesCTA() {
  const t = useTranslations('team_building.details');

  const [formState, setFormState] = useState({
    companyName: '',
    participants: '',
    preferredDate: '',
    contactName: '',
    contactEmail: '',
    specifications: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const detailItems = [
    { label: t('duration_lbl'), value: t('duration_val'), icon: "⏱" },
    { label: t('groups_lbl'), value: t('groups_val'), icon: "👥" },
    { label: t('availability_lbl'), value: t('availability_val'), icon: "📅" },
    { label: t('level_lbl'), value: t('level_val'), icon: "🎯" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        companyName: '',
        participants: '',
        preferredDate: '',
        contactName: '',
        contactEmail: '',
        specifications: ''
      });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="bg-[#0A1628] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative Wave Divider inside Navy block */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] text-white fill-current">
          <path d="M985.6,92.8C1061.5,92.8,1128,64,1200,20v100H0V20c72,44,138.5,72.8,214.4,72.8S373.1,64,445.1,20c72,44,138.5,72.8,214.4,72.8S793.1,64,865.1,20C937.1,64,985.6,92.8,985.6,92.8z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10 pt-10">
        
        {/* Left Column: Details Grid */}
        <div className="lg:col-span-5">
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {detailItems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={revealUp}
                whileHover={{ y: -6, borderColor: '#005F8A' }}
                className="bg-[#11223F] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg"
              >
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <div>
                  <span className="text-[10px] font-semibold text-[#B8D4E8] uppercase tracking-widest block mb-1">
                    {item.label}
                  </span>
                  <p className="text-base font-medium text-white">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Quote Form */}
        <div className="lg:col-span-7 bg-[#11223F] border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-2xl md:text-3xl font-serif text-[#B8D4E8] mb-2 leading-tight">
                  {t('form_title')}
                </h3>
                <p className="text-gray-400 text-sm mb-8">
                  {t('form_subtitle')}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                        {t('form_company')}
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formState.companyName}
                        onChange={handleChange}
                        required
                        className="bg-[#0A1628] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#005F8A] transition-colors duration-250 text-sm font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                        {t('form_people')}
                      </label>
                      <input
                        type="number"
                        name="participants"
                        value={formState.participants}
                        onChange={handleChange}
                        required
                        className="bg-[#0A1628] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#005F8A] transition-colors duration-250 text-sm font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                        {t('form_date')}
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formState.preferredDate}
                        onChange={handleChange}
                        required
                        className="bg-[#0A1628] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#005F8A] transition-colors duration-250 text-sm font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                        {t('form_contact')}
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formState.contactName}
                        onChange={handleChange}
                        required
                        className="bg-[#0A1628] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#005F8A] transition-colors duration-250 text-sm font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                      {t('form_email')}
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formState.contactEmail}
                      onChange={handleChange}
                      required
                      className="bg-[#0A1628] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#005F8A] transition-colors duration-250 text-sm font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                      {t('form_message')}
                    </label>
                    <textarea
                      name="specifications"
                      value={formState.specifications}
                      onChange={handleChange}
                      rows={4}
                      className="bg-[#0A1628] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#005F8A] transition-colors duration-250 text-sm resize-none font-sans"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(201,168,76,0)",
                        "0 0 25px rgba(201,168,76,0.3)",
                        "0 0 0px rgba(201,168,76,0)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#C9A84C] text-[#0A1628] font-bold py-3 sm:py-4 px-4 rounded-xl mt-4 cursor-pointer text-center text-xs sm:text-sm md:text-base transition-colors duration-200"
                  >
                    {isSubmitting ? '...' : t('cta_gold')}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-[#EBF5FB] text-[#005F8A] flex items-center justify-center text-3xl mx-auto mb-6">
                  ✓
                </div>
                <h3 className="text-2xl font-serif text-white mb-3">
                  ¡Muchas gracias!
                </h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8">
                  {t('form_success')}
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm font-semibold text-[#B8D4E8] hover:text-white border-b border-[#B8D4E8] pb-0.5 hover:border-white transition-colors duration-200"
                >
                  Volver al formulario
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
