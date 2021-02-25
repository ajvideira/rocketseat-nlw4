import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/ExperienceBar.module.css';

export default function ExperienceBar() {
  const { currentExperience, experienceNextLevel } = useContext(
    ChallengeContext
  );

  const percentToNextLevel = Math.round(
    (currentExperience * 100) / experienceNextLevel
  );

  return (
    <header className={styles.experienceBar}>
      <span>0 px</span>
      <div>
        <div style={{ width: `${percentToNextLevel}%` }}></div>
        <span
          className={styles.currentExperience}
          style={{ left: `${percentToNextLevel}%` }}
        >
          {currentExperience} px
        </span>
      </div>
      <span>{experienceNextLevel} px</span>
    </header>
  );
}
