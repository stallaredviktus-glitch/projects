import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { icon: '🧭', title: 'Проекты', text: 'Истории релизов, роль, стек и эффект.' },
  { icon: '🧪', title: 'Навыки', text: 'Подробные карточки и диаграммы прогресса.' },
  { icon: '✨', title: 'Анимации', text: 'Плавные переходы, скролл-сцены и детали UI.' },
];

type BadgeColor = 'purple' | 'cyan' | 'pink' | 'orange' | 'green' | 'blue' | 'yellow';

const badges: { name: string; color: BadgeColor }[][] = [
  [
    { name: 'Python', color: 'blue' },
    { name: 'C++', color: 'purple' },
    { name: 'JavaScript', color: 'yellow' },
    { name: 'TypeScript', color: 'cyan' },
  ],
  [
    { name: 'React', color: 'pink' },
    { name: 'FastAPI', color: 'green' },
    { name: 'Node.js', color: 'green' },
  ],
  [
    { name: 'Docker', color: 'blue' },
    { name: 'PyTorch', color: 'purple' },
    { name: 'Git', color: 'cyan' },
    { name: 'Figma', color: 'pink' },
  ],
  [
    { name: 'GSAP', color: 'green' },
    { name: 'VS Code', color: 'cyan' },
    { name: 'Adobe CC', color: 'orange' },
    { name: 'Blender', color: 'orange' },
  ],
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const panel = panelRef.current;
    const badgesGrid = badgesRef.current;
    if (!section || !content || !panel || !badgesGrid) return;

    const ctx = gsap.context(() => {
      // Parallax for content when scrolling away
      gsap.to(content, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Parallax for panel
      gsap.to(panel, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'center top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Initial reveal animation for content (excluding badges)
      const contentChildren = Array.from(content.children).filter(
        (child) => child !== badgesGrid
      );
      gsap.from(contentChildren, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2,
      });

      // Badges animation - each badge individually with stagger
      const allBadges = badgesGrid.querySelectorAll(`.${styles.badgesRow} > *`);
      gsap.fromTo(allBadges,
        { y: 20, opacity: 0, scale: 0.8 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power3.out',
          delay: 0.9,
        }
      );

      gsap.from(panel, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5,
      });

      // Panel steps stagger
      gsap.fromTo(
        panel.querySelectorAll(`.${styles.step}`),
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.8,
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" ref={sectionRef} className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <div ref={contentRef} className={styles.content}>
          <h1 className={styles.title}>Привет! Я разработчик</h1>
          <h2 className={styles.subtitle}>
            Создаю продукты, где данные, алгоритмы и интерфейс работают как одно целое.
          </h2>
          <p className={styles.description}>
            Проектирую backend-системы, ML-модули и фронтенд-сцены. Люблю чистую архитектуру,
            измеримый эффект и интерфейсы, в которые хочется зайти снова.
          </p>
          <div className={styles.actions}>
            <Button as="a" href="#projects" onClick={handleScrollToProjects}>
              Смотреть проекты
            </Button>
            <Button
              as="button"
              variant="secondary"
              onClick={() => {
                // Dispatch custom event to open contact modal
                window.dispatchEvent(new CustomEvent('openContactModal'));
              }}
            >
              Связаться
            </Button>
          </div>
          <div ref={badgesRef} className={styles.badgesGrid}>
            {badges.map((row, i) => (
              <div key={i} className={styles.badgesRow}>
                {row.map((badge) => (
                  <Badge key={badge.name} color={badge.color}>{badge.name}</Badge>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div ref={panelRef} className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.eyebrow}>С чего начать</span>
            <h3 className={styles.panelTitle}>Путеводитель по сайту</h3>
            <p className={styles.panelText}>
              Каждый кейс — это релиз, постер и тех-паспорт. Ниже — ключевые разделы и что в них искать.
            </p>
          </div>
          <div className={styles.steps}>
            {steps.map((step) => (
              <div key={step.title} className={styles.step}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
