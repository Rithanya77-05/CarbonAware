import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2, Leaf } from 'lucide-react';
import { useUserData } from '../context/UserDataContext';

// Rule-based response engine
const BOT_RESPONSES = [
  {
    keywords: ['reduce', 'carbon footprint', 'lower emissions', 'decrease emissions'],
    response: "Great question! 🌿 Start with your biggest emission category. Try carpooling or public transport, reduce AC usage by 1 hour/day, and go plant-based for 2 meals per week. Small consistent changes add up fast!",
  },
  {
    keywords: ['cycling', 'cycle', 'bike', 'bicycle', 'better than driving', 'car vs bike'],
    response: "Absolutely! 🚲 Cycling emits ZERO direct CO₂, while a car emits ~0.21 kg per km. For a 5km daily commute, cycling saves over 5 kg CO₂/week. It's also great for your health!",
  },
  {
    keywords: ['electricity', 'electric', 'energy', 'power', 'ac', 'appliance'],
    response: "⚡ Electricity tips: Set AC to 25°C instead of 18°C (saves ~30% energy), switch to LED bulbs, unplug devices on standby, and use the washing machine only with full loads. These changes can cut 20–30% of your energy footprint!",
  },
  {
    keywords: ['plastic', 'waste', 'packaging', 'single use', 'recycle', 'bin'],
    response: "♻️ To reduce plastic waste: carry a reusable bag, use a refillable water bottle, buy products with minimal packaging, and compost food scraps. Recycling one plastic bottle saves enough energy to power a light bulb for 6 hours!",
  },
  {
    keywords: ['score', 'improve score', 'carbon score', 'rating', 'grade'],
    response: "🎯 To improve your carbon score: (1) Use public transport 2x/week, (2) Reduce AC by 1 hr/day, (3) Try plant-based meals twice a week, (4) Complete daily Green Challenges to earn Eco Points. Track your progress on the Dashboard!",
  },
  {
    keywords: ['habits', 'daily', 'lifestyle', 'eco friendly', 'routine', 'everyday'],
    response: "🌱 Eco-friendly daily habits: Turn off lights when leaving rooms, use a reusable coffee cup, eat less red meat, take shorter showers, unplug chargers when not in use, and shop local. Every small action matters!",
  },
  {
    keywords: ['transport', 'transportation', 'travel', 'commute', 'bus', 'train', 'metro'],
    response: "🚌 Transport tips: Metro emits 0.03 kg CO₂/km vs 0.21 kg for a car — that's 7x less! Try public transport for at least 2 trips/week. For short distances under 2km, walking is both eco-friendly and healthy!",
  },
  {
    keywords: ['food', 'diet', 'eat', 'meal', 'vegetarian', 'vegan', 'meat'],
    response: "🥗 Food choices matter! A non-vegetarian diet produces ~35 kg CO₂/week vs ~10 kg for vegetarian. You don't need to go fully vegan — just 2 plant-based days/week can reduce food emissions by ~25%. Buy local and seasonal produce too!",
  },
  {
    keywords: ['challenge', 'points', 'badges', 'gamification', 'level'],
    response: "🏆 Complete your daily Green Challenges to earn Eco Points and level up from Beginner to Eco Warrior! Each completed challenge also unlocks special badges. Head to the Challenges page to get started!",
  },
  {
    keywords: ['personality', 'type', 'who am i', 'profile'],
    response: "🌍 Your Eco Personality is calculated automatically after each carbon calculation on the Dashboard. It tells you whether you're an Eco Warrior, Daily Commuter, Energy Heavy User, and more — with personalized tips!",
  },
  {
    keywords: ['roadmap', 'plan', 'steps', 'week', 'goal'],
    response: "📋 Your Sustainability Roadmap is a personalized 4-week action plan on your Dashboard. It's generated from your latest carbon calculation and shows week-by-week steps with estimated CO₂ savings. Tick off steps as you complete them!",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening'],
    response: "Hey there! 👋 I'm EcoBot, your personal sustainability assistant! Ask me anything about reducing your carbon footprint, eco habits, or how to use CarbonAware. I'm here to help! 🌱",
  },
  {
    keywords: ['thank', 'thanks', 'awesome', 'great', 'helpful', 'good bot'],
    response: "You're welcome! 🌿 Remember, every small action you take makes a difference. Keep tracking, keep improving, and together we'll build a greener future! 🌍",
  },
];

const DEFAULT_RESPONSE = "Great question! 🌱 I'm not sure I have a specific answer for that, but try asking about: reducing transport, electricity saving tips, food habits, plastic waste, your carbon score, or eco-friendly daily habits!";

const getBotResponse = (userInput) => {
  const lower = userInput.toLowerCase();
  for (const rule of BOT_RESPONSES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return rule.response;
    }
  }
  return DEFAULT_RESPONSE;
};

const SUGGESTIONS = [
  "How can I reduce my carbon footprint?",
  "Is cycling better than driving?",
  "How to reduce electricity usage?",
  "What are eco-friendly daily habits?",
];

const EcoBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { userData, addChatMessage, clearChat } = useUserData();
  const chatHistory = userData.chatHistory || [];
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, chatHistory.length]);

  // Show welcome message if no history
  const displayMessages = chatHistory.length === 0 && isOpen
    ? [{ role: 'bot', text: "Welcome to CarbonAware EcoBot 🌱 Hi there! I'm your personal sustainability assistant. How can I help you build a greener future today?" }]
    : chatHistory;

  const sendMessage = async (text) => {
    const message = text || inputText.trim();
    if (!message) return;

    setInputText('');
    addChatMessage({ role: 'user', text: message });
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
    const response = getBotResponse(message);
    setIsTyping(false);
    addChatMessage({ role: 'bot', text: response });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl shadow-green-500/40 flex items-center justify-center text-white"
        aria-label="Open EcoBot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[520px] flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-emerald-600">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
          <h4 className="text-sm font-bold text-white">EcoBot 🌱 · CarbonAware</h4>
                  <p className="text-xs text-green-100">Your sustainability assistant</p>
                </div>
              </div>
              {chatHistory.length > 0 && (
                <button onClick={clearChat} className="text-green-100 hover:text-white transition-colors p-1" title="Clear chat">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {displayMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Leaf className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-green-500 text-white rounded-br-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-400"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Suggestions (show when no messages) */}
            {chatHistory.length === 0 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask EcoBot anything..."
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 dark:text-white"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputText.trim() || isTyping}
                  className="w-10 h-10 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EcoBot;
