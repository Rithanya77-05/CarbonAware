import React from 'react';
import { Lightbulb } from 'lucide-react';

const generateRecommendations = (breakdown) => {
  if (!breakdown) return ["Complete your first carbon calculation to get personalized recommendations!"];
  
  const tips = [];
  const { transport, energy, food, waste } = breakdown;
  
  // Rule-based logic
  if (Number(transport) > 30) {
    tips.push("Your transport emissions are high. Consider carpooling, using public transit twice a week, or switching to a bike for short distances to save up to 10kg CO₂ weekly.");
  } else if (Number(transport) > 10) {
    tips.push("Great job keeping transport emissions moderate. Try walking for trips under 2km to further reduce your footprint.");
  }

  if (Number(energy) > 50) {
    tips.push("If you reduce AC usage by 1 hour daily, you can reduce emissions by approximately 10.5 kg CO₂ per week.");
    tips.push("Switch to LED bulbs and ensure unused appliances are unplugged to lower your energy footprint.");
  } else if (Number(energy) > 20) {
    tips.push("Consider running your washing machine only with full loads to save energy and water.");
  }

  if (Number(food) >= 30) {
    tips.push("A non-vegetarian diet contributes significantly to emissions. Trying one or two plant-based days a week can cut food-related emissions by up to 20%.");
  } else if (Number(food) >= 15) {
    tips.push("Buy local and seasonal produce to reduce the carbon footprint associated with food transportation.");
  }

  if (Number(waste) > 15) {
    tips.push("Your waste emissions indicate high plastic or food waste. Start composting food scraps and switch to reusable shopping bags.");
  } else {
    tips.push("You are doing well managing waste! Keep up the good work by recycling consistently.");
  }

  // Shuffle and pick top 3
  return tips.sort(() => 0.5 - Math.random()).slice(0, 3);
};

const Recommendations = ({ breakdown }) => {
  const recommendations = generateRecommendations(breakdown);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 rounded-xl">
          <Lightbulb className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smart Recommendations</h3>
      </div>
      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            {rec}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
