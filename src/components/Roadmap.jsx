import { motion } from 'framer-motion';
import { CheckCircle2, Target, TrendingDown, Car, Zap, Utensils, Trash2 } from 'lucide-react';
import { useUserData } from '../context/UserDataContext';

const categoryIcons = {
  transport: Car,
  energy: Zap,
  food: Utensils,
  waste: Trash2,
};

const categoryColors = {
  transport: 'text-blue-500',
  energy: 'text-yellow-500',
  food: 'text-green-500',
  waste: 'text-red-500',
};

const Roadmap = ({ currentFootprint }) => {
  const { userData, toggleRoadmapStep } = useUserData();
  const { roadmap } = userData;

  if (!roadmap || roadmap.length === 0) return null;

  const TARGET = 40;
  const totalPotentialReduction = roadmap.reduce((sum, s) => sum + Number(s.estimatedReduction), 0);
  const completedReduction = roadmap
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + Number(s.estimatedReduction), 0);

  const progressPct = Math.min((completedReduction / totalPotentialReduction) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sustainability Roadmap</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your personalized 4-week reduction plan</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Current</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{Number(currentFootprint).toFixed(1)}<span className="text-xs font-normal text-slate-500 ml-0.5">kg</span></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Target</p>
            <p className="text-lg font-bold text-green-500">{TARGET}<span className="text-xs font-normal text-slate-500 ml-0.5">kg</span></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Potential</p>
            <p className="text-lg font-bold text-blue-500">-{totalPotentialReduction.toFixed(1)}<span className="text-xs font-normal text-slate-500 ml-0.5">kg</span></p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Progress</span>
            <span className="font-medium text-green-600 dark:text-green-400">{progressPct.toFixed(0)}% complete</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="p-6 space-y-4">
        {roadmap.map((step, index) => {
          const CategoryIcon = categoryIcons[step.category] || TrendingDown;
          const catColor = categoryColors[step.category] || 'text-slate-500';
          const isLast = index === roadmap.length - 1;

          return (
            <div key={step.id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => toggleRoadmapStep(step.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 ${
                    step.completed
                      ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-green-400'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">{step.week}</span>
                  )}
                </button>
                {!isLast && (
                  <div className={`w-0.5 flex-1 mt-1 rounded-full ${step.completed ? 'bg-green-300 dark:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'}`} style={{ minHeight: '24px' }} />
                )}
              </div>

              {/* Step Content */}
              <div className={`flex-1 pb-4 ${isLast ? '' : 'border-b border-slate-100 dark:border-slate-700/50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <CategoryIcon className={`w-4 h-4 ${catColor}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Week {step.week} · {step.category}
                  </span>
                </div>
                <p className={`text-sm font-medium leading-relaxed ${step.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                  {step.action}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                    Save ~{step.estimatedReduction} kg CO₂/week
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Roadmap;
