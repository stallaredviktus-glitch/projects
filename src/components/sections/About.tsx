import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '../ui/Card';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '15+', label: 'завершённых проектов' },
  { value: '5+', label: 'лет опыта' },
  { value: '100%', label: 'фокус на результате' },
];

const listItems = [
  { label: 'Сильная сторона', value: 'Системное мышление и архитектура' },
  { label: 'Фокус', value: 'Понятные интерфейсы и надежный backend' },
  { label: 'Режим работы', value: 'Итерации, метрики, качество релиза' },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const sectionRect = section.getBoundingClientRect();
      const isAlreadyVisible = sectionRect.top < window.innerHeight * 0.75;

      const title = section.querySelector('.section-title');
      const avatarCard = section.querySelector(`.${styles.avatarCard}`);
      const textCard = section.querySelector(`.${styles.textCard}`);
      const listItems = section.querySelectorAll(`.${styles.listItem}`);
      const statItems = section.querySelectorAll(`.${styles.stat}`);
      const pills = section.querySelectorAll(`.${styles.pill}`);

      if (!isAlreadyVisible) {
        // Title animation
        gsap.fromTo(title,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );

        // Avatar card - slide from left
        gsap.fromTo(avatarCard,
          { x: -60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
          }
        );

        // Text card - slide from right
        gsap.fromTo(textCard,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
          }
        );

        // Pills stagger
        gsap.fromTo(pills,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: avatarCard, start: 'top 60%', toggleActions: 'play none none none' }
          }
        );

        // List items stagger
        gsap.fromTo(listItems,
          { x: 30, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: textCard, start: 'top 60%', toggleActions: 'play none none none' }
          }
        );

        // Stats stagger with scale
        gsap.fromTo(statItems,
          { y: 30, scale: 0.9, opacity: 0 },
          {
            y: 0, scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: statItems[0], start: 'top 85%', toggleActions: 'play none none none' }
          }
        );

        // Exit animation - subtle parallax when scrolling away
        gsap.to(avatarCard, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'bottom 80%',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to(textCard, {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'bottom 80%',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Animate stats numbers
      const statElements = section.querySelectorAll(`.${styles.statValue}`);
      statElements.forEach((el) => {
        const targetValue = el.getAttribute('data-value') || '0';
        const number = parseInt(targetValue.replace(/\D/g, ''), 10);
        const suffix = targetValue.replace(/\d/g, '');
        if (!Number.isFinite(number)) return;

        const elRect = el.getBoundingClientRect();
        const isElVisible = elRect.top < window.innerHeight * 0.85;

        if (isElVisible) {
          el.textContent = `${number}${suffix}`;
        } else {
          const counter = { value: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => {
              gsap.to(counter, {
                value: number,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = `${Math.round(counter.value)}${suffix}`;
                },
              });
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className={styles.about}>
      <div className="container">
        <h2 className="section-title"><span>Обо мне</span></h2>
        <div className={styles.grid}>
          <Card className={`${styles.avatarCard} reveal-item`}>
            <div className={styles.avatarContent}>
              <div className={styles.avatarCircle}>
                <span className={styles.avatarEmoji}>🙂</span>
              </div>
              <div className={styles.avatarInfo}>
                <h3 className={styles.name}>stallared</h3>
                <p className={styles.title}>ML Engineer · Full Stack Developer</p>
              </div>
              <div className={styles.pills}>
                <span className={styles.pill}>Backend</span>
                <span className={styles.pill}>ML</span>
                <span className={styles.pill}>Frontend</span>
              </div>
            </div>
          </Card>

          <Card className={`${styles.textCard} reveal-item`}>
            <div className={styles.textContent}>
              <p>
                Разрабатываю решения на стыке данных, backend и интерфейсов. Делаю продукты,
                где техническая часть поддерживает бизнес и пользователя.
              </p>
              <p>
                Люблю чистую архитектуру, быстрые итерации и измеримый результат. Открыт к
                сложным задачам и работе в команде.
              </p>
              <div className={styles.list}>
                {listItems.map((item) => (
                  <div key={item.label} className={styles.listItem}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <h3 className={styles.statValue} data-value={stat.value}>0</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
