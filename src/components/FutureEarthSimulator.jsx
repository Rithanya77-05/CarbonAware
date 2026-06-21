import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '../context/UserDataContext';
import { Globe, AlertTriangle, CheckCircle2, Factory, TreePine, Lightbulb, Home, Car } from 'lucide-react';

const FutureEarthSimulator = () => {
  const { userData } = useUserData();
  const { history, roadmap } = userData;
  const [activeScenario, setActiveScenario] = useState('current');

  const latestEntry = history.length > 0 ? history[history.length - 1] : null;
  const weeklyFootprint = latestEntry ? Number(latestEntry.footprint) : 150;
  
  // Calculate yearly projection (52 weeks)
  const yearlyCurrent = weeklyFootprint * 52;

  // Calculate potential sustainable projection
  let weeklyReduction;
  if (roadmap && roadmap.length > 0) {
    weeklyReduction = roadmap.reduce((sum, step) => sum + Number(step.estimatedReduction), 0);
  } else {
    // Fallback if no roadmap: assume 35% reduction is possible
    weeklyReduction = weeklyFootprint * 0.35;
  }
  
  const sustainableWeekly = Math.max(0, weeklyFootprint - weeklyReduction);
  const yearlySustainable = sustainableWeekly * 52;
  const yearlyReduction = yearlyCurrent - yearlySustainable;
  const reductionPct = ((yearlyReduction / yearlyCurrent) * 100).toFixed(0);

  // Equivalents
  const trees = Math.floor(yearlyReduction / 22); // ~22kg per tree per year
  const cars = (yearlyReduction / 4600).toFixed(1); // ~4600kg per car per year
  const bulbs = Math.floor(yearlyReduction / 8); // ~8kg per LED bulb per year
  const homes = (yearlyReduction / 5000).toFixed(1); // ~5000kg per home electricity per year

  const scenarios = {
    current: {
      id: 'current',
      title: 'Current Lifestyle',
      theme: 'red',
      bgClass: 'bg-red-50 dark:bg-red-900/10',
      borderClass: 'border-red-200 dark:border-red-900/50',
      textClass: 'text-red-600 dark:text-red-400',
      icon: AlertTriangle,
      projection: yearlyCurrent.toFixed(0),
      points: [
        'High emissions trajectory',
        'Increased environmental impact',
        'Larger personal carbon footprint',
        'Contributes to urban pollution'
      ],
      visuals: [Factory, Factory, AlertTriangle]
    },
    sustainable: {
      id: 'sustainable',
      title: 'Sustainable Lifestyle',
      theme: 'green',
      bgClass: 'bg-green-50 dark:bg-green-900/10',
      borderClass: 'border-green-200 dark:border-green-900/50',
      textClass: 'text-green-600 dark:text-green-400',
      icon: CheckCircle2,
      projection: yearlySustainable.toFixed(0),
      points: [
        'Cleaner local environment',
        `Reduced emissions by ${reductionPct}%`,
        'Sustainable future for next generations',
        'Healthier lifestyle choices'
      ],
      visuals: [TreePine, TreePine, Globe]
    }
  };

  const active = scenarios[activeScenario];
  const Icon = active.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <Globe className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Future Earth Simulator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">See how your choices shape the future.</p>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Toggle */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6 relative">
          <div 
            className="absolute inset-y-1 w-[calc(50%-4px)] bg-white dark:bg-slate-800 rounded-lg shadow-sm transition-transform duration-300 ease-in-out"
            style={{ 
              transform: activeScenario === 'current' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))' 
            }}
          />
          {Object.values(scenarios).map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScenario(s.id)}
              className={`flex-1 py-2.5 text-sm font-semibold z-10 transition-colors ${
                activeScenario === s.id 
                  ? s.theme === 'red' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Scenario Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScenario}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={`flex-1 rounded-2xl border p-6 flex flex-col ${active.bgClass} ${active.borderClass}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${active.textClass}`} />
                <h4 className={`text-lg font-bold ${active.textClass}`}>{active.title}</h4>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Projected Yearly</div>
                <div className={`text-3xl font-extrabold ${active.textClass}`}>
                  {active.projection} <span className="text-sm font-normal opacity-70">kg CO₂</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-6 py-8 mb-6">
               {active.visuals.map((VIcon, i) => (
                 <motion.div 
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                 >
                   <VIcon className={`w-16 h-16 ${active.textClass} opacity-80`} />
                 </motion.div>
               ))}
            </div>

            <div className="mt-auto space-y-3">
              {active.points.map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${active.theme === 'red' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Impact Equivalents */}
      {activeScenario === 'sustainable' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-6"
        >
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
            <span>Reduction Achieved: <span className="text-green-600 dark:text-green-400 font-bold">{yearlyReduction.toFixed(0)} kg CO₂</span></span>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Equivalent To</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
              <TreePine className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{trees}</div>
              <div className="text-xs text-slate-500">Trees Planted</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
              <Car className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{cars}</div>
              <div className="text-xs text-slate-500">Cars Removed</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
              <Lightbulb className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{bulbs}</div>
              <div className="text-xs text-slate-500">LED Bulbs</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
              <Home className="w-5 h-5 mx-auto mb-1 text-purple-500" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{homes}</div>
              <div className="text-xs text-slate-500">Homes Powered</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FutureEarthSimulator;
