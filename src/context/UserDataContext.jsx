import { createContext, useContext, useState, useEffect } from 'react';

const UserDataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

const defaultData = {
  onboarded: false,
  name: 'Eco Warrior',
  history: [],
  completedChallenges: [],
  ecoPoints: 0,
  badges: [],
  // Phase 2 additions
  personality: null,       // { type, name, icon, description, strengths, improvements }
  roadmap: [],             // Array of { id, week, action, estimatedReduction, completed }
  chatHistory: [],         // Array of { role: 'user'|'bot', text, timestamp }
};

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    if (typeof window !== 'undefined') {
      // Try new key first
      const saved = localStorage.getItem('carbonAwareUserData');
      if (saved) {
        try { return { ...defaultData, ...JSON.parse(saved) }; } catch (e) { console.error(e); }
      }
      // Migrate from legacy ecoTrackUserData key if it exists
      const legacy = localStorage.getItem('ecoTrackUserData');
      if (legacy) {
        try {
          const parsed = { ...defaultData, ...JSON.parse(legacy) };
          localStorage.setItem('carbonAwareUserData', JSON.stringify(parsed));
          localStorage.removeItem('ecoTrackUserData');
          return parsed;
        } catch (e) { console.error(e); }
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('carbonAwareUserData', JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (updates) => {
    setUserData((prev) => ({ ...prev, ...updates }));
  };

  const addHistoryEntry = (entry) => {
    setUserData((prev) => ({
      ...prev,
      history: [...prev.history, { ...entry, id: Date.now().toString(), date: new Date().toISOString() }]
    }));
  };

  const completeChallenge = (challengeId, points) => {
    setUserData((prev) => {
      if (prev.completedChallenges.includes(challengeId)) return prev;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
        ecoPoints: prev.ecoPoints + points,
      };
    });
  };

  const awardBadge = (badgeId) => {
    setUserData((prev) => {
      if (prev.badges.includes(badgeId)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
      };
    });
  };

  const setPersonality = (personality) => {
    setUserData((prev) => ({ ...prev, personality }));
  };

  const setRoadmap = (roadmap) => {
    setUserData((prev) => ({ ...prev, roadmap }));
  };

  const toggleRoadmapStep = (stepId) => {
    setUserData((prev) => ({
      ...prev,
      roadmap: prev.roadmap.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      ),
    }));
  };

  const addChatMessage = (message) => {
    setUserData((prev) => ({
      ...prev,
      chatHistory: [...(prev.chatHistory || []).slice(-50), { ...message, timestamp: Date.now() }],
    }));
  };

  const clearChat = () => {
    setUserData((prev) => ({ ...prev, chatHistory: [] }));
  };

  return (
    <UserDataContext.Provider value={{
      userData,
      updateUserData,
      addHistoryEntry,
      completeChallenge,
      awardBadge,
      setPersonality,
      setRoadmap,
      toggleRoadmapStep,
      addChatMessage,
      clearChat,
    }}>
      {children}
    </UserDataContext.Provider>
  );
};
