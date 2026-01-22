import { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills, skillCategories } from '../../data/skills';
import type { Skill } from '../../types';
import styles from './Skills.module.css';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

type CategoryFilter = 'all' | Skill['category'];

// Color mapping for tools - bright and readable
const toolColors: Record<string, string> = {
  // Python tools
  FastAPI: '#2dd4bf',
  Django: '#4ade80',
  Pandas: '#818cf8',
  NumPy: '#60a5fa',
  Celery: '#a3e635',
  SQLAlchemy: '#f87171',
  Pydantic: '#2dd4bf',
  'Async/Await': '#22d3ee',
  OpenAPI: '#4ade80',
  Dependencies: '#818cf8',
  'Background Tasks': '#fb923c',

  // JS/TS tools
  React: '#22d3ee',
  TypeScript: '#60a5fa',
  'Node.js': '#4ade80',
  GSAP: '#a3e635',
  Timeline: '#a3e635',
  ScrollTrigger: '#22d3ee',
  Tweens: '#fb923c',
  Easing: '#fde047',
  Plugins: '#a78bfa',
  Hooks: '#22d3ee',
  Context: '#60a5fa',
  'React Router': '#f87171',
  'React Query': '#fb923c',
  Zustand: '#a78bfa',
  'ES6+': '#fde047',
  'npm/yarn': '#f87171',
  Webpack: '#60a5fa',
  Vite: '#a78bfa',
  Generics: '#3178c6',
  'Utility Types': '#60a5fa',
  'Declaration Files': '#4ade80',
  'Strict Mode': '#f87171',

  // C++ tools
  STL: '#60a5fa',
  CMake: '#f87171',
  OpenGL: '#fb923c',
  CUDA: '#a3e635',

  // ML tools
  PyTorch: '#fb923c',
  Tensors: '#fb923c',
  Autograd: '#fde047',
  DataLoader: '#60a5fa',
  Lightning: '#a78bfa',
  TorchScript: '#22d3ee',

  // DevOps tools
  Docker: '#60a5fa',
  Dockerfile: '#60a5fa',
  Compose: '#22d3ee',
  'Multi-stage': '#4ade80',
  Networks: '#fb923c',
  Volumes: '#a78bfa',

  // Database tools
  PostgreSQL: '#60a5fa',
  JSONB: '#60a5fa',
  'Full-text Search': '#4ade80',
  Partitioning: '#fb923c',
  Replication: '#a78bfa',
  Extensions: '#22d3ee',

  // Tools - Git
  Branching: '#fb923c',
  Rebasing: '#4ade80',
  'Cherry-pick': '#60a5fa',
  Submodules: '#a78bfa',

  // Tools - Figma
  Components: '#e879f9',
  'Auto Layout': '#60a5fa',
  Prototyping: '#4ade80',
  'Dev Mode': '#22d3ee',

  // Tools - VS Code
  Debugging: '#f87171',
  Tasks: '#fb923c',
  Snippets: '#4ade80',
  'Remote Dev': '#a78bfa',

  // Tools - Adobe CC
  Photoshop: '#60a5fa',
  Illustrator: '#fb923c',
  'After Effects': '#a78bfa',
  Premiere: '#e879f9',

  // Tools - Blender
  Modeling: '#fb923c',
  Texturing: '#4ade80',
  Animation: '#60a5fa',
  Rendering: '#a78bfa',

  // Node.js tools
  Express: '#4ade80',
  Fastify: '#22d3ee',
  npm: '#f87171',
  'Event Loop': '#fde047',
  Streams: '#60a5fa',
};

function SkillCard({ skill, onClick }: {
  skill: Skill;
  onClick: () => void;
}) {
  return (
    <div
      className={styles.card}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      style={{ '--skill-color': skill.color } as React.CSSProperties}
    >
      {/* Card header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardLeft}>
          <span className={styles.emoji}>{skill.emoji}</span>
          <div className={styles.cardInfo}>
            <h3 className={styles.cardTitle}>{skill.title}</h3>
            <p className={styles.cardSubtitle}>{skill.subtitle}</p>
          </div>
        </div>
        <div className={styles.cardRight}>
          <div className={styles.percentBadge}>
            <span className={styles.percentValue}>{skill.percent}</span>
            <span className={styles.percentSign}>%</span>
          </div>
        </div>
      </div>

      {/* Mini progress bar */}
      <div className={styles.miniProgress}>
        <div
          className={styles.miniProgressFill}
          style={{ width: `${skill.percent}%` }}
        />
      </div>
    </div>
  );
}

function SkillModal({ skill, onClose }: {
  skill: Skill;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Animate modal in
    if (overlayRef.current && modalRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }

    // Animate progress bar
    if (progressRef.current) {
      gsap.fromTo(progressRef.current,
        { width: '0%' },
        { width: `${skill.percent}%`, duration: 1, ease: 'power3.out', delay: 0.3 }
      );
    }

    // Close on escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [skill.percent, onClose]);

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0, scale: 0.9, y: 20, duration: 0.2, ease: 'power2.in'
      });
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: onClose
      });
    }
  };

  const overlayStyle: React.CSSProperties = theme === 'light' ? {
    background: 'rgba(150, 150, 170, 0.4)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  } : {
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  };

  return (
    <div
      ref={overlayRef}
      className={styles.modalOverlay}
      style={overlayStyle}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        style={{ '--skill-color': skill.color } as React.CSSProperties}
      >
        {/* Close button */}
        <button className={styles.closeBtn} onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Modal header */}
        <div className={styles.modalHeader}>
          <span className={styles.modalEmoji}>{skill.emoji}</span>
          <div className={styles.modalInfo}>
            <h3 className={styles.modalTitle}>{skill.title}</h3>
            <p className={styles.modalSubtitle}>{skill.subtitle}</p>
          </div>
          <div className={styles.modalPercent}>
            <span className={styles.modalPercentValue}>{skill.percent}</span>
            <span className={styles.modalPercentSign}>%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Уровень владения</span>
            <span className={styles.yearsLabel}>{skill.years} {skill.years === 1 ? 'год' : skill.years < 5 ? 'года' : 'лет'} опыта</span>
          </div>
          <div className={styles.progressTrack}>
            <div ref={progressRef} className={styles.progressFill} />
          </div>
        </div>

        {/* Description */}
        <p className={styles.modalDescription}>{skill.detail}</p>

        {/* Tools and Highlights */}
        <div className={styles.modalGrid}>
          {/* Tools */}
          <div className={styles.toolsSection}>
            <span className={styles.toolsLabel}>Инструменты</span>
            <div className={styles.tools}>
              {skill.tools.map((tool) => (
                <span
                  key={tool}
                  className={styles.tool}
                  style={{ '--tool-color': toolColors[tool] || skill.color } as React.CSSProperties}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className={styles.highlightsSection}>
            <span className={styles.highlightsLabel}>Достижения</span>
            <ul className={styles.highlights}>
              {skill.highlights.map((highlight, i) => (
                <li key={i} className={styles.highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const hasAnimated = useRef(false);

  const filteredSkills = useMemo(() => {
    if (filter === 'all') return skills;
    return skills.filter((s) => s.category === filter);
  }, [filter]);

  // Initial scroll animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasAnimated.current) return;

    const ctx = gsap.context(() => {
      const sectionRect = section.getBoundingClientRect();
      const isAlreadyVisible = sectionRect.top < window.innerHeight * 0.75;

      const title = section.querySelector('.section-title');
      const lead = section.querySelector(`.${styles.lead}`);
      const filters = section.querySelector(`.${styles.filters}`);
      const cards = section.querySelectorAll(`.${styles.card}`);

      if (!isAlreadyVisible) {
        hasAnimated.current = true;

        gsap.fromTo(title,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );

        gsap.fromTo(lead,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );

        gsap.fromTo(filters,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );

        cards.forEach((card, index) => {
          gsap.fromTo(card,
            { y: 40, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.6, delay: index * 0.05, ease: 'power3.out',
              scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
            }
          );
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Animation on filter change
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll(`.${styles.card}`);

    gsap.fromTo(cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: 'power2.out' }
    );
  }, [filteredSkills]);

  return (
    <section id="skills" ref={sectionRef} className={styles.skills}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="section-title"><span>Навыки</span></h2>
          <p className={styles.lead}>
            Технологии и инструменты, с которыми работаю. Кликните на карточку для подробностей.
          </p>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          {Object.entries(skillCategories).map(([key, { label, color }]) => (
            <button
              key={key}
              className={`${styles.filterBtn} ${filter === key ? styles.active : ''}`}
              style={{ '--filter-color': color } as React.CSSProperties}
              onClick={() => setFilter(key as CategoryFilter)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onClick={() => setSelectedSkill(skill)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </section>
  );
}
