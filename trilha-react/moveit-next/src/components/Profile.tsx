import styles from '../styles/components/Profile.module.css';

export default function Profile() {
  return (
    <div className={styles.profileContainer}>
      <img src="https://github.com/ajvideira.png" alt="Foto perfil github" />
      <div>
        <strong>Jonathan Alba Videira</strong>
        <p>
          <img src="icons/level.svg" alt="level icon" />
          Level 1
        </p>
      </div>
    </div>
  );
}
