import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '../context/UserDataContext';
import { TreePine, Wind, Sun, Zap, Trophy } from 'lucide-react';

// Calculate a 0–100 sustainability score
const calcCityScore = (footprint, ecoPoints, completedChallenges) => {
  const fp = Number(footprint) || 150;
  // Footprint: 0kg = 50pts, 150kg = 0pts
  const fpScore = Math.max(0, (1 - fp / 150)) * 50;
  // EcoPoints: up to 200pts → 30 city score pts
  const ptScore = Math.min(1, ecoPoints / 200) * 30;
  // Challenges: up to 7 → 20 city score pts
  const chScore = Math.min(1, completedChallenges / 7) * 20;
  return Math.round(fpScore + ptScore + chScore);
};

const STAGES = [
  {
    range: [0, 30],
    level: 1,
    name: 'Polluted City',
    emoji: '🏭',
    status: 'Your city needs urgent sustainability improvements.',
    color: 'from-red-900/80 to-slate-900/80',
    badge: 'bg-red-900/50 text-red-300 border-red-700',
    skyColor: 'from-slate-700 to-slate-600',
    groundColor: 'bg-slate-600',
    elements: [
      { emoji: '🏭', label: 'Factory', count: 4, animate: true, size: 'text-5xl' },
      { emoji: '💨', label: 'Smog', count: 3, animate: true, size: 'text-3xl' },
    ],
    buildings: ['🏭', '🏢', '🏭', '🏢', '🏭'],
    sky: ['💨', '💨', '☁️', '💨'],
    ground: ['⬛', '⬛', '⬛', '⬛', '⬛'],
  },
  {
    range: [31, 50],
    level: 2,
    name: 'Improving City',
    emoji: '🌿',
    status: 'Positive changes are beginning to take shape.',
    color: 'from-amber-900/80 to-slate-800/80',
    badge: 'bg-amber-900/50 text-amber-300 border-amber-700',
    skyColor: 'from-amber-800 to-slate-700',
    groundColor: 'bg-amber-950',
    buildings: ['🏭', '🌳', '🏢', '🌳', '🏭'],
    sky: ['☁️', '💨', '☁️', '🌤️'],
    ground: ['⬛', '🌱', '⬛', '🌱', '⬛'],
  },
  {
    range: [51, 70],
    level: 3,
    name: 'Green Community',
    emoji: '🌳',
    status: 'Your community is becoming environmentally responsible.',
    color: 'from-green-900/80 to-slate-800/80',
    badge: 'bg-green-900/50 text-green-300 border-green-700',
    skyColor: 'from-sky-600 to-sky-400',
    groundColor: 'bg-green-800',
    buildings: ['🌳', '🏡', '🚲', '🏡', '🌳'],
    sky: ['🌤️', '☁️', '🌤️', '🌤️'],
    ground: ['🌿', '🌷', '🌿', '🌷', '🌿'],
  },
  {
    range: [71, 85],
    level: 4,
    name: 'Smart Eco City',
    emoji: '☀️',
    status: 'Your city is leading sustainable development.',
    color: 'from-emerald-900/80 to-blue-900/80',
    badge: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    skyColor: 'from-sky-500 to-blue-400',
    groundColor: 'bg-green-700',
    buildings: ['🌳', '☀️', '🏡', '🚲', '🌳'],
    sky: ['☀️', '🌤️', '🌤️', '☀️'],
    ground: ['🌿', '🌺', '🌿', '🌺', '🌿'],
  },
  {
    range: [86, 100],
    level: 5,
    name: 'Future Sustainable City',
    emoji: '🌍',
    status: '🎉 You have created a future-ready sustainable city!',
    color: 'from-green-800/80 to-teal-900/80',
    badge: 'bg-teal-900/50 text-teal-200 border-teal-600',
    skyColor: 'from-sky-400 to-blue-300',
    groundColor: 'bg-green-600',
    buildings: ['🌳', '☀️', '🏡', '🚲', '🌳', '🌊'],
    sky: ['☀️', '🦋', '🌤️', '🌈'],
    ground: ['🌿', '🌸', '🌺', '🌸', '🌿'],
  },
];

const getStage = (score) => {
  for (const stage of STAGES) {
    if (score >= stage.range[0] && score <= stage.range[1]) return stage;
  }
  return STAGES[0];
};

const getNextStageThreshold = (score) => {
  const currentStage = getStage(score);
  if (currentStage.level === 5) return 100;
  return STAGES[currentStage.level].range[0];
};

const CityScene = ({ stage, score }) => {
  const floatVariants = {
    animate: {
      y: [0, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <div className="relative rounded-2xl overflow-hidden h-52 select-none">
      {/* Sky gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${stage.skyColor}`} />

      {/* Sky elements */}
      <div className="absolute top-2 left-0 right-0 flex justify-around px-4">
        {stage.sky.map((el, i) => (
          <motion.span
            key={i}
            className="text-2xl"
            animate={{ y: [0, -5, 0], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          >
            {el}
          </motion.span>
        ))}
      </div>

      {/* Buildings row */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-around items-end px-4">
        {stage.buildings.map((building, i) => (
          <motion.span
            key={i}
            className="text-4xl sm:text-5xl drop-shadow-lg"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: 'backOut' }}
            whileHover={{ scale: 1.15, y: -4 }}
          >
            {building}
          </motion.span>
        ))}
      </div>

      {/* Ground strip */}
      <div className={`absolute bottom-0 left-0 right-0 h-10 ${stage.groundColor} flex justify-around items-center px-4`}>
        {stage.ground.map((g, i) => (
          <motion.span
            key={i}
            className="text-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          >
            {g}
          </motion.span>
        ))}
      </div>

      {/* Stage level badge */}
      <div className="absolute top-2 right-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${stage.badge}`}>
          Level {stage.level}
        </span>
      </div>
    </div>
  );
};

const GreenCitySimulator = () => {
  const { userData } = useUserData();
  const { history, ecoPoints, completedChallenges } = userData;

  const latestEntry = history.length > 0 ? history[history.length - 1] : null;
  const footprint = latestEntry ? Number(latestEntry.footprint) : 150;

  const cityScore = useMemo(
    () => calcCityScore(footprint, ecoPoints, completedChallenges.length),
    [footprint, ecoPoints, completedChallenges.length]
  );

  const stage = getStage(cityScore);
  const nextThreshold = getNextStageThreshold(cityScore);
  const prevThreshold = stage.range[0];
  const progressInStage =
    stage.level === 5
      ? 100
      : Math.round(((cityScore - prevThreshold) / (nextThreshold - prevThreshold)) * 100);

  const treesGenerated = Math.floor(Math.max(0, (150 - footprint) / 10) + completedChallenges.length);
  const emissionReduction = Math.max(0, ((150 - footprint) / 150) * 100).toFixed(0);
  const challengeImpact = Math.min(100, completedChallenges.length * 15);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              🌳 Your Sustainable City
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Watch your city become greener as your footprint decreases.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">City Score</div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{cityScore}<span className="text-base font-normal text-slate-400">/100</span></div>
          </div>
        </div>
      </div>

      {/* City Scene */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.level}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            <CityScene stage={stage} score={cityScore} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stage Info */}
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{stage.emoji} {stage.name}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stage.status}</p>
          </div>
          {stage.level < 5 && (
            <div className="text-right shrink-0 ml-4">
              <span className="text-xs text-slate-400">Next level at</span>
              <div className="text-sm font-bold text-green-500">{nextThreshold} pts</div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Progress to {stage.level < 5 ? `Level ${stage.level + 1}` : 'Max Level'}</span>
            <span className="font-semibold text-green-500">{progressInStage}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressInStage}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              className={`h-full rounded-full bg-gradient-to-r ${stage.color.replace('/80', '')}`}
              style={{ background: 'linear-gradient(90deg, #22c55e, #15803d)' }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="px-6 pb-6 grid grid-cols-3 gap-3">
        {[
          { icon: TreePine, label: 'Trees Generated', value: treesGenerated, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
          { icon: Trophy, label: 'Challenge Impact', value: `+${challengeImpact}%`, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { icon: Wind, label: 'CO₂ Reduced', value: `${emissionReduction}%`, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-3 text-center`}>
            <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
            <div className={`text-lg font-extrabold ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* Current Level Stats */}
      <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-700 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Level</div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><span className="text-lg">{stage.emoji}</span> {stage.name}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Carbon Score</div>
          <div className="font-bold text-slate-900 dark:text-white text-lg">{cityScore}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Next Level</div>
          <div className="font-bold text-slate-900 dark:text-white">{stage.level < 5 ? STAGES[stage.level].name : 'Max Level Reached'}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Points Needed</div>
          <div className="font-bold text-green-500 text-lg">{stage.level < 5 ? nextThreshold - cityScore : 0}</div>
        </div>
      </div>

      {/* City Evolution Guide */}
      <div className="px-6 pb-8 bg-slate-50 dark:bg-slate-900/30 pt-6">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">City Evolution Guide</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {STAGES.map((s) => {
            const isActive = stage.level === s.level;
            return (
              <div key={s.level} className={`p-4 rounded-xl border flex flex-col text-center ${isActive ? 'bg-white dark:bg-slate-800 border-green-500 shadow-md ring-1 ring-green-500' : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                <div className="text-2xl mb-2">{s.buildings.slice(0, Math.min(s.buildings.length, 4)).join('')}{s.level === 5 ? '🌊' : ''}</div>
                <div className={`text-sm font-bold mb-1 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>{s.name}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-auto pt-1">Score: {s.range[0]}–{s.range[1]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default GreenCitySimulator;
