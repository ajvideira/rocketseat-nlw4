import { createContext, ReactNode, useEffect, useState } from 'react';

import Cookies from 'js-cookie';

import challenges from '../../challenges.json';
import LevelUpModal from '../components/LevelUpModal';

interface ChallengeProviderProps {
  children: ReactNode;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengesContextData {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallenge: Challenge;
  experienceNextLevel: number;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
  closeLevelUpModal: () => void;
}

export const ChallengeContext = createContext({} as ChallengesContextData);

export function ChallengeProvider({
  children,
  ...rest
}: ChallengeProviderProps) {
  const [level, setLevel] = useState(rest.level);
  const [currentExperience, setCurrentExperience] = useState(
    rest.currentExperience
  );
  const [challengesCompleted, setChallengesCompleted] = useState(
    rest.challengesCompleted
  );
  const [activeChallenge, setActiveChallenge] = useState(null);

  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  const experienceNextLevel = Math.pow((level + 1) * 4, 2);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengesCompleted', String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted]);

  function levelUp() {
    setLevel(level + 1);
  }

  function startNewChallenge() {
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted') {
      new Notification('Novo desafio 🎉', {
        body: `Valendo ${challenge.amount}xp!`,
      });
    }
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  function completeChallenge() {
    if (!activeChallenge) {
      return;
    }

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if (finalExperience > experienceNextLevel) {
      finalExperience = finalExperience - experienceNextLevel;
      levelUp();
      setIsLevelUpModalOpen(true);
    }
    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1);
  }

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false);
  }

  return (
    <ChallengeContext.Provider
      value={{
        level,
        currentExperience,
        challengesCompleted,
        activeChallenge,
        experienceNextLevel,
        levelUp,
        startNewChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal,
      }}
    >
      {children}
      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengeContext.Provider>
  );
}
