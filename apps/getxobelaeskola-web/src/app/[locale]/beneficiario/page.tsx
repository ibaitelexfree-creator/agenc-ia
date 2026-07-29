'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function BeneficiarioPage() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center relative overflow-hidden px-4 py-24">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-50 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-100 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 max-w-3xl w-full"
      >
        <div className="bg-white border-2 border-gray-200 p-8 md:p-14 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-100 to-transparent opacity-60" />
          
          <div className="flex flex-col items-center text-center space-y-10 relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-[0_10px_30px_rgba(220,38,38,0.3)] rotate-3"
            >
              <ShieldCheck className="w-10 h-10 text-white -rotate-3" />
            </motion.div>

            <div className="space-y-5">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm md:text-base font-sans tracking-[0.3em] text-red-600 uppercase font-bold"
              >
                Beneficiario
              </motion.h1>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-black leading-tight"
              >
                Club Deportivo <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-blue-900">
                  Pakea Munduari Itzulia
                </span>
              </motion.h2>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="w-32 h-1 bg-gray-200 rounded-full my-4"
            />

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-50 border border-gray-200 px-6 py-5 rounded-2xl flex flex-col md:flex-row items-center gap-5 hover:bg-white transition-all duration-300 hover:border-red-300 group shadow-md"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#003399] border-2 border-white flex items-center justify-center shadow group-hover:scale-105 transition-transform duration-300">
                <span className="text-sm font-bold text-[#FFCC00] tracking-wider">EU</span>
              </div>
              <p className="text-sm md:text-base font-sans text-black font-medium leading-relaxed">
                Financiado por la Unión Europea <br className="md:hidden" />
                <span className="text-red-600 font-bold block md:inline md:ml-1">
                  Next Generation EU
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
