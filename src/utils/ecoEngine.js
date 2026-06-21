// Eco Personality Engine - pure logic, no React
// Returns a personality object based on emission breakdown

export const PERSONALITIES = {
  ecoWarrior: {
    type: 'ecoWarrior',
    name: 'Eco Warrior',
    emoji: '🌍',
    tagline: 'You are an Eco Warrior — a true champion of the planet!',
    description: 'You maintain low emissions across all categories. Your daily choices are making a real positive impact on the environment.',
    strengths: ['Low overall carbon footprint', 'Balanced sustainability habits', 'Strong environmental awareness'],
    improvements: ['Share your habits with others', 'Take on more advanced eco challenges', 'Encourage community sustainability'],
    color: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-400',
  },
  consciousConsumer: {
    type: 'consciousConsumer',
    name: 'Conscious Consumer',
    emoji: '♻️',
    tagline: 'You are a Conscious Consumer — making mindful choices!',
    description: 'You have moderate emissions overall and demonstrate good sustainability habits across multiple categories.',
    strengths: ['Balanced awareness across categories', 'Actively making eco-friendly choices', 'Good waste management habits'],
    improvements: ['Focus on your highest emission category', 'Explore public transport options', 'Try plant-based meals twice a week'],
    color: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-400',
  },
  dailyCommuter: {
    type: 'dailyCommuter',
    name: 'Daily Commuter',
    emoji: '🚗',
    tagline: 'You are a Daily Commuter — transport is your biggest impact area!',
    description: 'Transportation accounts for the majority of your carbon footprint. Switching to greener transport options could make a huge difference.',
    strengths: ['Good energy and food habits', 'Aware of transport emissions', 'Opportunity for significant quick improvement'],
    improvements: ['Use public transport 2x per week', 'Consider carpooling or cycling short distances', 'Work from home when possible'],
    color: 'from-orange-500 to-amber-600',
    bgLight: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-400',
  },
  energyHeavyUser: {
    type: 'energyHeavyUser',
    name: 'Energy Heavy User',
    emoji: '⚡',
    tagline: 'You are an Energy Heavy User — your home consumes a lot!',
    description: 'Electricity consumption is your primary carbon contributor. Small changes at home can lead to substantial emission reductions.',
    strengths: ['Likely has good transport habits', 'Potential for big impact with small changes', 'Low waste generation'],
    improvements: ['Reduce AC usage by 1 hour/day', 'Switch to LED bulbs throughout your home', 'Unplug appliances when not in use'],
    color: 'from-yellow-500 to-orange-500',
    bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-500',
  },
  wasteCreator: {
    type: 'wasteCreator',
    name: 'Waste Creator',
    emoji: '🗑️',
    tagline: 'You are a Waste Creator — reducing waste is your next step!',
    description: 'Waste generation is a significant contributor to your footprint. Adopting a zero-waste mindset can dramatically cut your emissions.',
    strengths: ['May have good transport habits', 'Awareness of the issue is half the battle', 'Quick wins available through recycling'],
    improvements: ['Start composting food waste', 'Switch to reusable bags and bottles', 'Buy products with minimal packaging'],
    color: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-700 dark:text-red-400',
  },
  greenExplorer: {
    type: 'greenExplorer',
    name: 'Green Explorer',
    emoji: '🌱',
    tagline: 'You are a Green Explorer — just starting your sustainability journey!',
    description: 'Welcome to the world of sustainability! Every small change you make today builds a better planet for tomorrow.',
    strengths: ['Open to learning and change', 'Starting fresh with great potential', 'Every action from here is an improvement'],
    improvements: ['Complete your first carbon calculation', 'Take on easy daily challenges', 'Explore your Dashboard for personalized tips'],
    color: 'from-teal-500 to-green-600',
    bgLight: 'bg-teal-50 dark:bg-teal-900/20',
    borderColor: 'border-teal-200 dark:border-teal-800',
    textColor: 'text-teal-700 dark:text-teal-400',
  },
};

export const classifyPersonality = (breakdown, total) => {
  if (!breakdown || !total || Number(total) === 0) return PERSONALITIES.greenExplorer;

  const t = Number(breakdown.transport);
  const e = Number(breakdown.energy);
  const w = Number(breakdown.waste);
  const tot = Number(total);

  const transportPct = t / tot;
  const energyPct = e / tot;
  const wastePct = w / tot;

  if (tot < 35) return PERSONALITIES.ecoWarrior;
  if (transportPct > 0.5) return PERSONALITIES.dailyCommuter;
  if (energyPct > 0.5) return PERSONALITIES.energyHeavyUser;
  if (wastePct > 0.3) return PERSONALITIES.wasteCreator;
  if (tot < 80) return PERSONALITIES.consciousConsumer;
  return PERSONALITIES.dailyCommuter; // fallback for high overall
};

export const generateRoadmap = (breakdown, total) => {
  if (!breakdown || !total) return [];

  const t = Number(breakdown.transport);
  const e = Number(breakdown.energy);
  const f = Number(breakdown.food);
  const w = Number(breakdown.waste);

  // Sort categories by emission size descending
  const categories = [
    { name: 'transport', value: t },
    { name: 'energy', value: e },
    { name: 'food', value: f },
    { name: 'waste', value: w },
  ].sort((a, b) => b.value - a.value);

  const actionMap = {
    transport: [
      { action: 'Use public transport or carpool at least twice this week instead of driving.', reduction: (t * 0.25).toFixed(1) },
      { action: 'Replace one daily car trip with cycling or walking.', reduction: (t * 0.15).toFixed(1) },
    ],
    energy: [
      { action: 'Reduce AC usage by 1 hour per day and set it to 25°C when in use.', reduction: (e * 0.20).toFixed(1) },
      { action: 'Unplug all appliances on standby and switch to LED lighting.', reduction: (e * 0.10).toFixed(1) },
    ],
    food: [
      { action: 'Try 2 plant-based meals this week to reduce food-related emissions.', reduction: (f * 0.15).toFixed(1) },
      { action: 'Buy local and seasonal produce to cut food transport emissions.', reduction: (f * 0.10).toFixed(1) },
    ],
    waste: [
      { action: 'Start composting food scraps and use a reusable bag for shopping.', reduction: (w * 0.30).toFixed(1) },
      { action: 'Switch to reusable water bottles and avoid single-use plastic.', reduction: (w * 0.20).toFixed(1) },
    ],
  };

  const steps = [];
  let weekNum = 1;

  for (const cat of categories.slice(0, 2)) {
    const actions = actionMap[cat.name];
    for (const act of actions) {
      if (steps.length < 4) {
        steps.push({
          id: `roadmap-${weekNum}`,
          week: weekNum,
          category: cat.name,
          action: act.action,
          estimatedReduction: act.reduction,
          completed: false,
        });
        weekNum++;
      }
    }
  }

  // Fill remaining weeks if needed
  const remaining = categories.slice(2);
  for (const cat of remaining) {
    if (steps.length < 4) {
      const actions = actionMap[cat.name];
      steps.push({
        id: `roadmap-${weekNum}`,
        week: weekNum,
        category: cat.name,
        action: actions[0].action,
        estimatedReduction: actions[0].reduction,
        completed: false,
      });
      weekNum++;
    }
  }

  return steps;
};
