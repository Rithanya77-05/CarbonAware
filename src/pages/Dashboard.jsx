import { useMemo } from 'react';
import { useUserData } from '../context/UserDataContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TreePine, Wind, Activity, TrendingDown } from 'lucide-react';
import Recommendations from '../components/Recommendations';
import EcoPersonality from '../components/EcoPersonality';
import Roadmap from '../components/Roadmap';
import CompareCard from '../components/CompareCard';
import GreenCitySimulator from '../components/GreenCitySimulator';
import FutureEarthSimulator from '../components/FutureEarthSimulator';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#eab308', '#22c55e', '#ef4444'];

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-6"
  >
    <div className={`p-4 rounded-2xl ${color}`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { userData } = useUserData();
  const { history, ecoPoints, personality, roadmap } = userData;

  const latestEntry = history.length > 0 ? history[history.length - 1] : null;

  const pieData = useMemo(() => {
    if (!latestEntry) return [];
    return [
      { name: 'Transport', value: Number(latestEntry.breakdown.transport) },
      { name: 'Energy', value: Number(latestEntry.breakdown.energy) },
      { name: 'Food', value: Number(latestEntry.breakdown.food) },
      { name: 'Waste', value: Number(latestEntry.breakdown.waste) }
    ];
  }, [latestEntry]);

  const trendData = useMemo(() => {
    return history.slice(-7).map((entry, index) => ({
      name: `Day ${index + 1}`,
      total: Number(entry.footprint),
    }));
  }, [history]);

  const treesEquivalent = latestEntry ? Math.max(0, Math.floor((150 - Number(latestEntry.footprint)) / 10)) : 0;
  const carbonSaved = latestEntry ? Math.max(0, 150 - Number(latestEntry.footprint)).toFixed(1) : 0;

  if (history.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🌱</div>
        <h2 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
          You haven't calculated your carbon footprint yet. Take the first step towards a greener future!
        </p>
        <Link to="/calculator" className="inline-flex items-center px-8 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors shadow-lg">
          Calculate My Footprint →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* ── SECTION 1: Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Latest Footprint" value={`${latestEntry.footprint} kg`} subtitle="CO₂ / week" icon={Activity} color="bg-blue-100 dark:bg-blue-900/30 text-blue-500" delay={0} />
        <StatCard title="Carbon Saved" value={`${carbonSaved} kg`} subtitle="vs global avg (150kg)" icon={TrendingDown} color="bg-green-100 dark:bg-green-900/30 text-green-500" delay={0.05} />
        <StatCard title="Trees Equivalent" value={treesEquivalent} subtitle="Emissions absorbed" icon={TreePine} color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500" delay={0.1} />
        <StatCard title="Eco Points" value={ecoPoints} subtitle="From challenges" icon={Wind} color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500" delay={0.15} />
      </div>

      {/* ── SECTION 2: Eco Personality ── */}
      {personality && <EcoPersonality personality={personality} />}

      {/* ── SECTION 3: Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <h3 className="text-xl font-bold mb-6">Emissions Breakdown</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-slate-600 dark:text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <h3 className="text-xl font-bold mb-6">Footprint Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis tick={{ fill: '#888', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#000' }} />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── SECTION 4: Compare ── */}
      <div className="grid grid-cols-1 gap-8">
        <CompareCard currentFootprint={latestEntry?.footprint} />
      </div>

      {/* ── SECTION 5: Sustainability Roadmap ── */}
      {roadmap && roadmap.length > 0 && (
        <Roadmap currentFootprint={latestEntry?.footprint} />
      )}

      {/* ── SECTION 6: Green City Evolution Simulator ── */}
      <GreenCitySimulator />

      {/* ── SECTION 7: Future Earth Simulator ── */}
      <FutureEarthSimulator />

      {/* ── SECTION 8: Smart Recommendations ── */}
      <Recommendations breakdown={latestEntry?.breakdown} />

      {/* ── SECTION 9: History ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm"
      >
        <h3 className="text-xl font-bold mb-5">Calculation History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-2">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Footprint</th>
                <th className="pb-3 pr-4">Transport</th>
                <th className="pb-3 pr-4">Energy</th>
                <th className="pb-3 pr-4">Food</th>
                <th className="pb-3">Waste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {[...history].reverse().slice(0, 8).map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="py-3 pr-4 text-slate-500">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="py-3 pr-4 font-bold text-slate-900 dark:text-white">{entry.footprint} kg</td>
                  <td className="py-3 pr-4 text-blue-600 dark:text-blue-400">{entry.breakdown.transport} kg</td>
                  <td className="py-3 pr-4 text-yellow-600 dark:text-yellow-400">{entry.breakdown.energy} kg</td>
                  <td className="py-3 pr-4 text-green-600 dark:text-green-400">{entry.breakdown.food} kg</td>
                  <td className="py-3 text-red-600 dark:text-red-400">{entry.breakdown.waste} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;
