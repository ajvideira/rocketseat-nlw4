import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/Profile.module.css';

export default function Profile() {
  const { level } = useContext(ChallengeContext);

  return (
    <div className={styles.profileContainer}>
      <img src="https://github.com/ajvideira.png" alt="Foto perfil github" />
      <div>
        <strong>Jonathan Alba Videira</strong>
        <p>
          <img src="icons/level.svg" alt="level icon" />
          Level {level}
        </p>
      </div>
    </div>
  );
}
