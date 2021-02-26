import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengeContext';
import styles from '../styles/components/LevelUpModal.module.css';

export default function LevelUpModal() {
  const { level, closeLevelUpModal } = useContext(ChallengeContext);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header>{level}</header>
        <strong>Parabéns</strong>
        <p>Você alcançou um novo level.</p>

        <button type="button">
          <img src="icons/close.svg" alt="Fechar" onClick={closeLevelUpModal} />
        </button>
      </div>
    </div>
  );
}
