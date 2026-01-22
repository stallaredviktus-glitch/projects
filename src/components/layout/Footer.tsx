import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Моё портфолио. Все права защищены.</p>
    </footer>
  );
}
