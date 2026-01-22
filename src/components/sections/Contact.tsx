import styles from './Contact.module.css';

interface SocialLink {
  name: string;
  url: string;
  colorClass: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Gmail',
    url: 'mailto:vasy.strunov@gmail.com',
    colorClass: styles.gmail,
  },
  {
    name: 'Telegram',
    url: 'https://t.me/stallared',
    colorClass: styles.telegram,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/stalared_nt?igsh=ZTRhNjh4eGlucHYz',
    colorClass: styles.instagram,
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@bevelspirit?_r=1&_t=ZS-93Hx9fTJs1d',
    colorClass: styles.tiktok,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/stallaredviktus-glitch',
    colorClass: styles.github,
  },
];

export default function Contact() {
  return (
    <section className={styles.contact}>
      <div className={styles.container}>
        <h2 className={styles.title}>Связаться</h2>
        <p className={styles.subtitle}>
          Свяжитесь со мной через любую из этих платформ
        </p>

        <div className={styles.socialGrid}>
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${link.colorClass}`}
              aria-label={link.name}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
