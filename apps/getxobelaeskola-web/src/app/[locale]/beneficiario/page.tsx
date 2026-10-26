import Image from 'next/image';
import { ShieldCheck, Award } from 'lucide-react';

export default function BeneficiarioPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center relative overflow-hidden px-4 py-24 sm:py-28">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 max-w-2xl w-full">
        <div className="bg-white border border-slate-200/80 p-8 sm:p-12 md:p-14 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-red-50 to-transparent pointer-events-none" />

          <div className="flex flex-col items-center text-center relative z-10">
            {/* Header Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-[0_10px_25px_rgba(220,38,38,0.25)] mb-6">
              <ShieldCheck className="w-9 h-9 sm:w-10 sm:h-10 text-white" />
            </div>

            <span className="text-xs sm:text-sm font-sans tracking-[0.25em] sm:tracking-[0.3em] text-red-600 uppercase font-black mb-2">
              Getxo Bela Eskola
            </span>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 uppercase tracking-widest mb-6">
              Beneficiario
            </h1>

            {/* Beneficiary Card */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 text-center space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Razón Social / Titular
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-slate-900 leading-snug">
                Asociación club deportivo vela Pakea munduari itzulia
              </h2>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 text-sm sm:text-base font-mono font-bold text-slate-800 shadow-sm">
                <span className="text-slate-500 font-sans font-semibold text-xs uppercase tracking-wider">CIF:</span>
                <span>G95526299</span>
              </div>
            </div>

            {/* NextGen EU Funding Section */}
            <div className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 transition-colors p-6 sm:p-8 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-sm">
              <div className="h-14 sm:h-16 w-full max-w-[280px] sm:max-w-[320px] relative flex items-center justify-center">
                <Image
                  src="/images/logo-nextgen.svg"
                  alt="Financiado por la Unión Europea - NextGenerationEU"
                  width={320}
                  height={64}
                  className="object-contain h-full w-auto"
                  priority
                />
              </div>
              <p className="text-xs sm:text-sm font-sans text-slate-700 font-medium leading-relaxed max-w-md">
                Financiado por la Unión Europea <span className="font-bold text-slate-900 block sm:inline">Next Generation EU</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
