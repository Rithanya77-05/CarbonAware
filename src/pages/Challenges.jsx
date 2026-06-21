import { useMemo } from 'react';
import { useUserData } from '../context/UserDataContext';
import { Trophy, Star, Medal, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const CHALLENGES_LIST = [
  { id: 'c1', title: 'Walk 2 km today', desc: 'Replace a short car trip with walking.', points: 10, difficulty: 'Easy' },
  { id: 'c2', title: 'Use public transport', desc: 'Take a bus or train instead of driving.', points: 15, difficulty: 'Medium' },
  { id: 'c3', title: 'Avoid single-use plastic', desc: 'Say no to plastic bags, straws, and bottles.', points: 10, difficulty: 'Easy' },
  { id: 'c4', title: 'Turn off unused lights', desc: 'Ensure all lights are off in empty rooms.', points: 5, difficulty: 'Easy' },
  { id: 'c5', title: 'Carry reusable bottle', desc: 'Use a reusable water bottle all day.', points: 5, difficulty: 'Easy' },
  { id: 'c6', title: 'Plant a tree', desc: 'Plant a sapling in your community.', points: 50, difficulty: 'Hard' },
  { id: 'c7', title: 'Reduce food waste', desc: 'Eat all leftovers and compost scraps.', points: 15, difficulty: 'Medium' },
];

const BADGES_LIST = [
  { id: 'b1', title: 'First Challenge Completed', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { id: 'b2', title: 'Carbon Reducer', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  { id: 'b3', title: 'Eco Friendly Traveler', icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'b4', title: 'Sustainability Champion', icon: Medal, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
];

const getLevelInfo = (points) => {
  if (points >= 500) return { name: 'Eco Warrior', next: null, progress: 100 };
  if (points >= 200) return { name: 'Sustainability Hero', next: 500, progress: (points - 200) / 300 * 100 };
  if (points >= 100) return { name: 'Green Champion', next: 200, progress: (points - 100) / 100 * 100 };
  if (points >= 50) return { name: 'Eco Explorer', next: 100, progress: (points - 50) / 50 * 100 };
  return { name: 'Beginner', next: 50, progress: points / 50 * 100 };
};

const Challenges = () => {
  const { userData, completeChallenge, awardBadge } = useUserData();
  const { ecoPoints, completedChallenges, badges } = userData;

  const levelInfo = getLevelInfo(ecoPoints);

  const handleComplete = (challenge) => {
    completeChallenge(challenge.id, challenge.points);
    if (completedChallenges.length === 0) {
      awardBadge('b1');
    }
    if (challenge.id === 'c1' || challenge.id === 'c2') {
      awardBadge('b3');
    }
    if (ecoPoints + challenge.points >= 100) {
      awardBadge('b4');
    }
  };

  const leaderboard = useMemo(() => {
    const list = [
      { rank: 1, name: 'Alex Green', saved: 250, points: 540 },
      { rank: 2, name: 'Sarah O.', saved: 180, points: 410 },
      { rank: 3, name: userData.name, saved: userData.history.length > 0 ? 150 - Number(userData.history[userData.history.length-1].footprint) : 0, points: ecoPoints, isUser: true },
      { rank: 4, name: 'Mike T.', saved: 90, points: 150 },
    ];
    return list.sort((a, b) => b.points - a.points).map((item, idx) => ({...item, rank: idx + 1}));
  }, [userData, ecoPoints]);

  const diffColors = {
    Easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    Hard: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & User Level */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Gamification Hub</h1>
            <p className="text-slate-500 dark:text-slate-400">Complete challenges, earn points, and level up your impact.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl md:min-w-[300px]">
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Current Level</div>
                <div className="text-2xl font-bold text-green-500">{levelInfo.name}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{ecoPoints} <span className="text-sm font-medium text-slate-500">pts</span></div>
              </div>
            </div>
            {levelInfo.next && (
              <>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${levelInfo.progress}%` }} 
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  />
                </div>
                <div className="text-xs text-slate-500 text-right">{levelInfo.next - ecoPoints} points to next level</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Challenges List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Daily Challenges</h2>
          <div className="grid gap-4">
            {CHALLENGES_LIST.map((challenge) => {
              const isCompleted = completedChallenges.includes(challenge.id);
              return (
                <div key={challenge.id} className={`p-6 rounded-2xl border transition-all ${isCompleted ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-green-300 dark:hover:border-green-700'}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-lg font-bold ${isCompleted ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{challenge.title}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${diffColors[challenge.difficulty]}`}>{challenge.difficulty}</span>
                      </div>
                      <p className={`text-sm ${isCompleted ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>{challenge.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-[80px]">
                      <span className="font-bold text-blue-500">+{challenge.points} pts</span>
                      {isCompleted ? (
                        <div className="flex items-center text-green-500 font-medium text-sm">
                          <CheckCircle2 className="w-5 h-5 mr-1" /> Done
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleComplete(challenge)}
                          className="px-4 py-2 bg-slate-100 hover:bg-green-500 hover:text-white dark:bg-slate-700 dark:hover:bg-green-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Badges & Leaderboard */}
        <div className="space-y-8">
          
          {/* Badges */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Your Badges</h3>
            <div className="grid grid-cols-2 gap-4">
              {BADGES_LIST.map((badge) => {
                const earned = badges.includes(badge.id);
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-opacity ${earned ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 opacity-100' : 'border-dashed border-slate-200 dark:border-slate-700 opacity-40 grayscale'}`}>
                    <div className={`p-3 rounded-full mb-3 ${badge.bg} ${badge.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold leading-tight">{badge.title}</span>
                  </div>
                );
              })}
            </div>
            {badges.length === 0 && (
              <p className="text-sm text-center text-slate-500 mt-4">Complete challenges to earn your first badge!</p>
            )}
          </div>

          {/* Leaderboard */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Leaderboard</h3>
            <div className="space-y-4">
              {leaderboard.map((user) => (
                <div key={user.name} className={`flex items-center justify-between p-3 rounded-xl ${user.isUser ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-bold ${user.rank === 1 ? 'text-yellow-500' : user.rank === 2 ? 'text-slate-400' : user.rank === 3 ? 'text-amber-600' : 'text-slate-500'}`}>
                      #{user.rank}
                    </span>
                    <span className={`font-medium ${user.isUser ? 'text-green-700 dark:text-green-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                      {user.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{user.points} <span className="text-xs font-normal text-slate-500">pts</span></span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Challenges;
