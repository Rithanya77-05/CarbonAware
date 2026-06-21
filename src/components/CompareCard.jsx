import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingDown, TrendingUp, Award } from 'lucide-react';

const AVERAGE_FOOTPRINT = 95;

const CompareCard = ({ currentFootprint }) => {
  if (!currentFootprint) return null;

  const current = Number(currentFootprint);
  const diff = AVERAGE_FOOTPRINT - current;
  const isBetter = diff > 0;
  const pctDiff = Math.abs(((diff / AVERAGE_FOOTPRINT) * 100)).toFixed(0);

  // Visual bar widths: normalize against 150kg max
  const MAX = 150;
  const userBarWidth = Math.min((current / MAX) * 100, 100);
  const avgBarWidth = Math.min((AVERAGE_FOOTPRINT / MAX) * 100, 100);

  const message = isBetter
    ? `Great job! You're ${pctDiff}% below the average user. Keep up the great work! 🎉`
    : `You're ${pctDiff}% above the average. Follow your sustainability roadmap to improve!`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
          <Users className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Compare vs. Average</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">How you stack up against a typical user</p>
        </div>
      </div>

      {/* Big Result Badge */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 ${isBetter ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800'}`}>
        {isBetter ? (
          <TrendingDown className="w-8 h-8 text-green-500 shrink-0" />
        ) : (
          <TrendingUp className="w-8 h-8 text-amber-500 shrink-0" />
        )}
        <div>
          <p className={`text-2xl font-extrabold ${isBetter ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {isBetter ? `${pctDiff}% Better Than Average` : `${pctDiff}% Above Average`}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{message}</p>
        </div>
      </div>

      {/* Comparison Bars */}
      <div className="space-y-5">
        {/* Your bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> You
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{current.toFixed(1)} kg/week</span>
          </div>
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${userBarWidth}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600"
            />
          </div>
        </div>

        {/* Average bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 inline-block" /> Average User
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{AVERAGE_FOOTPRINT} kg/week</span>
          </div>
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${avgBarWidth}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Difference callout */}
      <div className="mt-5 flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
        <Award className={`w-5 h-5 shrink-0 ${isBetter ? 'text-green-500' : 'text-amber-500'}`} />
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {isBetter
            ? `You save ${diff.toFixed(1)} kg CO₂/week more than the average user — equivalent to planting ${Math.max(1, Math.floor(diff / 10))} extra trees!`
            : `Reducing by just ${Math.abs(diff).toFixed(1)} kg/week would bring you to the average. You can do it!`}
        </p>
      </div>
    </motion.div>
  );
};

export default CompareCard;
