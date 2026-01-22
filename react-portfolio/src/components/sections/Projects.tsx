import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, categories } from '../../data/projects';
import type { Project } from '../../types';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

type CategoryFilter = 'all' | Project['category'];

// Color mapping for technology tags - bright and readable
const tagColors: Record<string, string> = {
  // Languages
  Python: '#60a5fa',
  JavaScript: '#fde047',
  TypeScript: '#60a5fa',
  'C++': '#a78bfa',

  // Frontend
  React: '#22d3ee',
  'React Three Fiber': '#22d3ee',
  'Three.js': '#a78bfa',
  WebGL: '#ff6b6b',
  GLSL: '#e879f9',
  GPGPU: '#e879f9',
  'CSS Modules': '#60a5fa',
  Storybook: '#fb7185',
  'D3.js': '#fb923c',
  Lenis: '#22d3ee',
  GSAP: '#a3e635',
  Blender: '#fb923c',

  // Backend
  FastAPI: '#2dd4bf',
  'Node.js': '#4ade80',
  Express: '#a3e635',

  // Databases
  PostgreSQL: '#60a5fa',
  MongoDB: '#4ade80',
  Redis: '#f87171',

  // ML/AI
  PyTorch: '#fb923c',
  Transformers: '#fde047',
  spaCy: '#22d3ee',
  OpenCV: '#a78bfa',
  ONNX: '#60a5fa',
  TensorRT: '#a3e635',

  // DevOps
  Docker: '#60a5fa',
  Kubernetes: '#818cf8',
  'GitHub Actions': '#60a5fa',
  Helm: '#818cf8',
  Celery: '#4ade80',

  // Other
  Airflow: '#60a5fa',
  'Apache Spark': '#fb923c',
  SDR: '#fb7185',
  'RTL-SDR': '#fb7185',
  DSP: '#e879f9',
  ImGui: '#60a5fa',
};

// Carousel component for year groups with multiple projects
function YearCarousel({
  yearProjects,
}: {
  yearProjects: Project[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const goTo = useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(index, yearProjects.length - 1));
    setCurrentIndex(newIndex);

    if (trackRef.current) {
      const cards = trackRef.current.querySelectorAll(`.${styles.card}`);
      gsap.to(cards, {
        x: -newIndex * 100 + '%',
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [yearProjects.length]);

  // Handle wheel/trackpad scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track || yearProjects.length <= 1) return;

    let accumulatedDelta = 0;
    const threshold = 50;

    const handleWheel = (e: WheelEvent) => {
      // Use deltaX for horizontal (trackpad), deltaY for vertical (mouse wheel)
      const isHorizontalGesture = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontalGesture ? e.deltaX : e.deltaY;

      if (Math.abs(delta) < 5) return;

      // Check if we can scroll in the requested direction
      const canScrollNext = delta > 0 && currentIndex < yearProjects.length - 1;
      const canScrollPrev = delta < 0 && currentIndex > 0;

      // If can't scroll carousel, let page scroll naturally
      if (!canScrollNext && !canScrollPrev) return;

      // Block page scroll only when we can navigate the carousel
      e.preventDefault();
      e.stopPropagation();

      if (isScrolling.current) return;

      accumulatedDelta += delta;

      if (Math.abs(accumulatedDelta) >= threshold) {
        isScrolling.current = true;

        if (canScrollNext) {
          goTo(currentIndex + 1);
        } else if (canScrollPrev) {
          goTo(currentIndex - 1);
        }

        accumulatedDelta = 0;
        setTimeout(() => {
          isScrolling.current = false;
        }, 400);
      }
    };

    track.addEventListener('wheel', handleWheel, { passive: false });
    return () => track.removeEventListener('wheel', handleWheel);
  }, [currentIndex, yearProjects.length, goTo]);

  // Touch swipe support
  useEffect(() => {
    const track = trackRef.current;
    if (!track || yearProjects.length <= 1) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0 && currentIndex < yearProjects.length - 1) {
          goTo(currentIndex + 1);
        } else if (diffX < 0 && currentIndex > 0) {
          goTo(currentIndex - 1);
        }
      }
    };

    track.addEventListener('touchstart', handleTouchStart);
    track.addEventListener('touchend', handleTouchEnd);
    return () => {
      track.removeEventListener('touchstart', handleTouchStart);
      track.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, yearProjects.length, goTo]);

  const hasMultiple = yearProjects.length > 1;

  return (
    <div className={styles.carouselWrapper}>
      <div ref={trackRef} className={styles.carouselTrack}>
        <div className={styles.carouselSlides}>
          {yearProjects.map((project) => (
            <article key={project.id} className={styles.card}>
              <div
                className={styles.cardHeader}
                style={{ '--card-grad': project.gradient } as React.CSSProperties}
              >
                <span className={styles.cardEmoji}>{project.emoji}</span>
                {project.metrics && (
                  <div className={styles.cardMetric}>
                    <div className={styles.metricValue}>{project.metrics.value}</div>
                    <div className={styles.metricLabel}>{project.metrics.label}</div>
                  </div>
                )}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <span
                    className={styles.categoryBadge}
                    style={{ '--cat-color': categories[project.category].color } as React.CSSProperties}
                  >
                    {categories[project.category].label}
                  </span>
                  <span className={styles.roleBadge}>{project.role}</span>
                </div>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDescription}>{project.description}</p>
                <div className={styles.highlights}>
                  {project.highlights.map((highlight, i) => (
                    <span key={i} className={styles.highlight}>{highlight}</span>
                  ))}
                </div>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={styles.tag}
                      style={{ '--tag-color': tagColors[tag] || 'var(--text-1)' } as React.CSSProperties}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {hasMultiple && (
        <div className={styles.dots}>
          {yearProjects.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Перейти к проекту ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const hasAnimated = useRef(false);

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter]);

  // Group projects by year
  const projectsByYear = useMemo(() => {
    const grouped = new Map<number, Project[]>();
    filteredProjects.forEach((project) => {
      const existing = grouped.get(project.year) || [];
      grouped.set(project.year, [...existing, project]);
    });
    // Sort years descending
    return Array.from(grouped.entries()).sort((a, b) => b[0] - a[0]);
  }, [filteredProjects]);

  // Initial scroll animations (only once)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasAnimated.current) return;

    const ctx = gsap.context(() => {
      const sectionRect = section.getBoundingClientRect();
      const isAlreadyVisible = sectionRect.top < window.innerHeight * 0.75;

      const title = section.querySelector('.section-title');
      const lead = section.querySelector(`.${styles.lead}`);
      const filters = section.querySelector(`.${styles.filters}`);
      const yearGroups = section.querySelectorAll(`.${styles.yearGroup}`);

      if (!isAlreadyVisible) {
        hasAnimated.current = true;

        // Title animation
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

        // Year groups animation
        yearGroups.forEach((group) => {
          const groupRect = group.getBoundingClientRect();
          if (groupRect.top >= window.innerHeight * 0.85) {
            gsap.fromTo(group,
              { y: 50, opacity: 0 },
              {
                y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none none' }
              }
            );
          }
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Animation on filter change (not on initial load)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const yearGroups = section.querySelectorAll(`.${styles.yearGroup}`);

    gsap.fromTo(yearGroups,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, [filteredProjects]);

  return (
    <section id="projects" ref={sectionRef} className={styles.projects}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="section-title"><span>Проекты</span></h2>
          <p className={styles.lead}>
            Мой путь в разработке: от первых сайтов до ML-систем и highload-архитектур.
          </p>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          {Object.entries(categories).map(([key, { label, color }]) => (
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

        <div className={styles.timeline}>
          {projectsByYear.map(([year, yearProjects]) => (
            <div key={year} className={styles.yearGroup}>
              <div className={styles.yearLabel}>
                <span className={styles.yearDot} />
                <span className={styles.yearText}>{year}</span>
              </div>
              <YearCarousel yearProjects={yearProjects} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
