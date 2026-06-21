import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Car, Leaf, Trash2, Recycle, Sprout, ArrowUpRight } from 'lucide-react';

const iconMap = {
  ecoWarrior: Leaf,
  consciousConsumer: Recycle,
  dailyCommuter: Car,
  energyHeavyUser: Zap,
  wasteCreator: Trash2,
  greenExplorer: Sprout,
};

const EcoPersonality = ({ personality }) => {
  if (!personality) return null;

  const Icon = iconMap[personality.type] || Leaf;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl border p-6 ${personality.bgLight} ${personality.borderColor}`}
    >
      {/* Decorative gradient blob */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${personality.color} opacity-20 blur-3xl`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${personality.color} shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">Eco Personality</p>
              <h3 className={`text-xl font-extrabold ${personality.textColor}`}>{personality.name} {personality.emoji}</h3>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 leading-relaxed italic">
          "{personality.tagline}"
        </p>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
          {personality.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-white/60 dark:bg-slate-900/40 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Strengths
            </h4>
            <ul className="space-y-1.5">
              {personality.strengths.map((s, i) => (
                <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-white/60 dark:bg-slate-900/40 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
              <ArrowUpRight className="w-3 h-3" /> Areas to Improve
            </h4>
            <ul className="space-y-1.5">
              {personality.improvements.map((imp, i) => (
                <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">→</span> {imp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EcoPersonality;
