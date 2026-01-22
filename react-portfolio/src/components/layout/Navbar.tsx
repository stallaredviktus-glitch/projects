import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Modal } from '../ui/Modal';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '#home', label: 'Главная' },
  { href: '#about', label: 'Обо мне' },
  { href: '#projects', label: 'Проекты' },
  { href: '#skills', label: 'Навыки' },
];

const socialLinks = [
  { name: 'Gmail', url: 'mailto:vasy.strunov@gmail.com', colorClass: 'gmail' },
  { name: 'Telegram', url: 'https://t.me/stallared', colorClass: 'telegram' },
  { name: 'Instagram', url: 'https://www.instagram.com/stalared_nt?igsh=ZTRhNjh4eGlucHYz', colorClass: 'instagram' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@bevelspirit?_r=1&_t=ZS-93Hx9fTJs1d', colorClass: 'tiktok' },
  { name: 'GitHub', url: 'https://github.com/stallaredviktus-glitch', colorClass: 'github' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollY = window.pageYOffset;
      const isMobile = window.innerWidth <= 768;

      // Auto-hide header on scroll down, show on scroll up (mobile only)
      if (isMobile) {
        if (scrollY > lastScrollY.current && scrollY > 100) {
          setIsHidden(true);
          setIsOpen(false); // Close menu when hiding
        } else {
          setIsHidden(false);
        }
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = scrollY;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          setActiveSection(sectionId || '');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for custom event to open contact modal
  useEffect(() => {
    const handleOpenContactModal = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('openContactModal', handleOpenContactModal);
    return () => window.removeEventListener('openContactModal', handleOpenContactModal);
  }, []);


  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav className={`${styles.navbar} ${isHidden ? styles.hidden : ''}`}>
        <div className={styles.container}>
          <div className={styles.brand}>
            <h1>Моё портфолио</h1>
          </div>

          <button
            className={`${styles.toggle} ${isOpen ? styles.active : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-label="Открыть меню"
          >
            <span />
            <span />
            <span />
          </button>

          {/* Desktop menu - inside navbar */}
          <ul className={styles.desktopMenu}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`${styles.link} ${activeSection === link.href.slice(1) ? styles.active : ''}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu - outside navbar for backdrop-filter to work */}
      <ul className={`${styles.mobileMenu} ${isOpen ? styles.open : ''} ${isHidden ? styles.hidden : ''}`}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`${styles.link} ${activeSection === link.href.slice(1) ? styles.active : ''}`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <ThemeToggle />
        </li>
      </ul>

      {/* Contact Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Связаться со мной</h2>
          <p className={styles.modalSubtitle}>Выберите удобный способ связи</p>
          <div className={styles.modalSocials}>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.modalSocialLink} ${styles[link.colorClass]}`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
