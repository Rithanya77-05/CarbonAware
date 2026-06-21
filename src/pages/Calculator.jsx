import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { Car, Zap, Utensils, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { classifyPersonality, generateRoadmap } from '../utils/ecoEngine';

const calculateFootprint = (data) => {
  // Constants (kg CO2 per unit)
  const factors = {
    transport: { car: 0.21, bike: 0.1, bus: 0.08, train: 0.04, metro: 0.03, walking: 0, cycling: 0 },
    energy: { ac: 1.5, fan: 0.05, tv: 0.1, fridge: 0.1, washing: 0.5 },
    food: { vegetarian: 10, mixed: 20, 'non-vegetarian': 35 },
    waste: { plastic: 6, food: 2.5, recyclable: 0.5 }
  };

  // calculate weekly values
  const transportEmissions = (data.distance * factors.transport[data.vehicle]) * 7;
  const energyEmissions = (
    (data.acHours * factors.energy.ac) +
    (data.fanHours * factors.energy.fan) +
    (data.tvHours * factors.energy.tv) +
    (data.fridgeHours * factors.energy.fridge) +
    (data.washingUsage * factors.energy.washing)
  ) * 7;
  const foodEmissions = factors.food[data.diet]; // Already weekly
  const wasteEmissions = (
    (data.plasticWaste * factors.waste.plastic) +
    (data.foodWaste * factors.waste.food) +
    (data.recyclableWaste * factors.waste.recyclable)
  );

  const total = transportEmissions + energyEmissions + foodEmissions + wasteEmissions;

  let score = 'Critical';
  if (total < 30) score = 'Excellent';
  else if (total < 60) score = 'Good';
  else if (total < 100) score = 'Moderate';
  else if (total < 150) score = 'High';

  return {
    total: total.toFixed(2),
    score,
    breakdown: {
      transport: transportEmissions.toFixed(2),
      energy: energyEmissions.toFixed(2),
      food: foodEmissions.toFixed(2),
      waste: wasteEmissions.toFixed(2)
    }
  };
};

const SectionCard = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="w-full max-w-xl bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm"
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-500">
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </motion.div>
);

const Calculator = () => {
  const { addHistoryEntry, setPersonality, setRoadmap } = useUserData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    vehicle: 'car',
    distance: 15,
    acHours: 2,
    fanHours: 4,
    tvHours: 2,
    fridgeHours: 24,
    washingUsage: 1,
    diet: 'mixed',
    plasticWaste: 2,
    foodWaste: 1,
    recyclableWaste: 2
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCalculate = () => {
    const res = calculateFootprint(formData);
    setResult(res);
    addHistoryEntry({ footprint: res.total, breakdown: res.breakdown });
    const personality = classifyPersonality(res.breakdown, res.total);
    setPersonality(personality);
    const roadmap = generateRoadmap(res.breakdown, res.total);
    setRoadmap(roadmap);
    setStep(5);
  };

  const scoreColors = {
    Excellent: 'text-green-500',
    Good: 'text-green-400',
    Moderate: 'text-yellow-500',
    High: 'text-orange-500',
    Critical: 'text-red-500'
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      
      {step === 1 && (
        <SectionCard title="Transportation" icon={Car}>
          <div>
            <label htmlFor="vehicle" className="block text-sm font-medium mb-2">Primary Mode of Transport</label>
            <select id="vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-green-500 outline-none">
              <option value="car">Car</option>
              <option value="bike">Motorbike</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="metro">Metro</option>
              <option value="walking">Walking</option>
              <option value="cycling">Cycling</option>
            </select>
          </div>
          <div>
            <label htmlFor="distance" className="block text-sm font-medium mb-2">Daily Distance (km)</label>
            <input id="distance" type="number" name="distance" min="0" value={formData.distance} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <button onClick={() => setStep(2)} className="w-full mt-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex justify-center items-center gap-2">
            Next <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </SectionCard>
      )}

      {step === 2 && (
        <SectionCard title="Electricity Consumption" icon={Zap}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="acHours" className="block text-sm font-medium mb-2">AC (hours/day)</label>
              <input id="acHours" type="number" name="acHours" min="0" value={formData.acHours} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
            </div>
            <div>
              <label htmlFor="fanHours" className="block text-sm font-medium mb-2">Fan (hours/day)</label>
              <input id="fanHours" type="number" name="fanHours" min="0" value={formData.fanHours} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
            </div>
            <div>
              <label htmlFor="tvHours" className="block text-sm font-medium mb-2">TV (hours/day)</label>
              <input id="tvHours" type="number" name="tvHours" min="0" value={formData.tvHours} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
            </div>
            <div>
              <label htmlFor="washingUsage" className="block text-sm font-medium mb-2">Washing Machine (uses/day)</label>
              <input id="washingUsage" type="number" name="washingUsage" min="0" value={formData.washingUsage} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Back</button>
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors">Next</button>
          </div>
        </SectionCard>
      )}

      {step === 3 && (
        <SectionCard title="Food Habits" icon={Utensils}>
          <div>
            <label className="block text-sm font-medium mb-4">What best describes your diet?</label>
            <div className="space-y-3">
              {['vegetarian', 'mixed', 'non-vegetarian'].map((diet) => (
                <label key={diet} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.diet === diet ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input type="radio" name="diet" value={diet} checked={formData.diet === diet} onChange={handleChange} className="hidden" />
                  <span className="capitalize font-medium">{diet.replace('-', ' ')}</span>
                  {formData.diet === diet && <CheckCircle2 className="ml-auto text-green-500 w-5 h-5" />}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={() => setStep(2)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Back</button>
            <button onClick={() => setStep(4)} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors">Next</button>
          </div>
        </SectionCard>
      )}

      {step === 4 && (
        <SectionCard title="Waste Generation" icon={Trash2}>
          <div>
            <label htmlFor="plasticWaste" className="block text-sm font-medium mb-2">Plastic Waste (kg/week)</label>
            <input id="plasticWaste" type="number" name="plasticWaste" min="0" value={formData.plasticWaste} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
          </div>
          <div>
            <label htmlFor="foodWaste" className="block text-sm font-medium mb-2">Food Waste (kg/week)</label>
            <input id="foodWaste" type="number" name="foodWaste" min="0" value={formData.foodWaste} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
          </div>
          <div>
            <label htmlFor="recyclableWaste" className="block text-sm font-medium mb-2">Recyclable Waste (kg/week)</label>
            <input id="recyclableWaste" type="number" name="recyclableWaste" min="0" value={formData.recyclableWaste} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
          </div>
          
          <div className="flex gap-4 mt-8">
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Back</button>
            <button onClick={handleCalculate} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">Calculate</button>
          </div>
        </SectionCard>
      )}

      {step === 5 && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 max-w-2xl w-full mx-auto text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
          <h2 className="text-3xl font-bold mb-8">Your Carbon Footprint</h2>
          
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-700" />
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${Math.min((result.total / 150) * 251, 251)} 251`} className="text-green-500 transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold">{result.total}</span>
              <span className="text-sm text-slate-500 font-medium">kg CO₂/week</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg text-slate-600 dark:text-slate-400 mb-2">Carbon Score</h3>
            <span className={`text-2xl font-bold px-6 py-2 rounded-full bg-slate-50 dark:bg-slate-900 ${scoreColors[result.score]}`}>
              {result.score}
            </span>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => { setStep(1); setFormData({...formData}); }} className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Recalculate</button>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors">View Dashboard</button>
          </div>
        </motion.div>
      )}

      {/* Progress Indicators */}
      {step < 5 && (
        <div className="flex gap-2 mt-8">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-3 h-3 rounded-full transition-colors ${step === s ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Calculator;
