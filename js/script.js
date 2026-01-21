// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Highlight active nav link on scroll
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    document.querySelectorAll('section').forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 200;
        const sectionId = section.getAttribute('id');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Mobile burger menu
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('is-open');
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('is-open');
        });
    });
}

// Compact header on mobile scroll (leave only burger)
function updateMobileHeader() {
    if (window.innerWidth > 768) {
        document.body.classList.remove('nav-compact');
        return;
    }

    if (window.pageYOffset > 40) {
        document.body.classList.add('nav-compact');
    } else {
        document.body.classList.remove('nav-compact');
    }
}

updateMobileHeader();
window.addEventListener('scroll', updateMobileHeader, { passive: true });
window.addEventListener('resize', updateMobileHeader);

// Floating scroll button (down by sections, up by sections near the bottom)
const scrollFab = document.getElementById('scrollFab');
const sections = Array.from(document.querySelectorAll('section'));
let fabMode = 'down';
let fabBlocked = false;

function updateScrollFab() {
    if (!scrollFab) return;
    const scrollPos = window.pageYOffset + window.innerHeight;
    const nearBottom = scrollPos >= document.documentElement.scrollHeight - 20;
    const nearTop = window.pageYOffset <= 20;
    const tooSmall = window.innerWidth <= 520 || window.innerHeight <= 520;

    if (nearBottom) {
        fabMode = 'up';
    } else if (nearTop) {
        fabMode = 'down';
    }

    scrollFab.classList.toggle('is-up', fabMode === 'up');
    scrollFab.classList.toggle('is-hidden', fabBlocked || tooSmall);
    scrollFab.setAttribute(
        'aria-label',
        fabMode === 'up' ? 'Наверх по разделам' : 'Вниз по разделам'
    );
}

function scrollToSection(direction) {
    if (sections.length === 0) return;
    const currentY = window.pageYOffset;
    const buffer = 10;
    if (direction === 'down') {
        const next = sections.find((section) => section.offsetTop > currentY + buffer);
        if (next) {
            next.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        const prev = [...sections].reverse().find((section) => section.offsetTop < currentY - buffer);
        if (prev) {
            prev.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

if (scrollFab) {
    updateScrollFab();
    scrollFab.addEventListener('click', () => {
        scrollToSection(fabMode === 'up' ? 'up' : 'down');
        window.setTimeout(updateScrollFab, 200);
    });
    window.addEventListener('scroll', updateScrollFab, { passive: true });
    window.addEventListener('resize', updateScrollFab);

    const footer = document.querySelector('.footer');
    if (footer) {
        const fabObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    fabBlocked = entry.isIntersecting;
                    updateScrollFab();
                });
            },
            { rootMargin: '0px 0px -10% 0px' }
        );
        fabObserver.observe(footer);
    }
}

// Animate counters in stats
function animateCounter(element) {
    if (element.dataset.animated === 'true') return;
    element.dataset.animated = 'true';

    const text = element.textContent.trim();
    const number = parseInt(text.replace(/\D/g, ''), 10);
    const suffix = text.replace(/\d/g, '');
    if (!Number.isFinite(number)) return;

    const duration = 900;
    const start = performance.now();

    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(number * progress);
        element.textContent = `${value}${suffix}`;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = `${number}${suffix}`;
        }
    };

    requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('h3');
                if (statValue) {
                    animateCounter(statValue);
                }
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.4 }
);

document.querySelectorAll('.stat').forEach((stat) => {
    statObserver.observe(stat);
});

// Reveal blocks on scroll
const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -100px 0px' }
);

const revealTargets = document.querySelectorAll(
    '.project-card, .skill-card, .stat, .about-card, .about-textcard'
);
revealTargets.forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// Skill circle charts
function drawCircle(canvas, percent) {
    const ctx = canvas.getContext('2d');
    const radius = 50;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const lineWidth = 6;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#7c3aed');
    gradient.addColorStop(1, '#22d3ee');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (percent / 100) * 2 * Math.PI;
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();

    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${percent}%`, centerX, centerY);
}

function animateSkillChart(canvas, percent, duration = 1400) {
    const start = performance.now();

    const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(percent * progress);
        drawCircle(canvas, value);
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            drawCircle(canvas, percent);
        }
    };

    requestAnimationFrame(animate);
}

function renderTwemoji(target) {
    if (window.twemoji && target) {
        window.twemoji.parse(target, { folder: 'svg', ext: '.svg' });
    }
}

// Theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const bodyEl = document.body;
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

    const applyTheme = (theme) => {
        bodyEl.classList.add('theme-transition');
        bodyEl.classList.toggle('light-theme', theme === 'light');
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '\u2600\uFE0F' : '\uD83C\uDF15';
            renderTwemoji(themeIcon);
        }
        localStorage.setItem('theme', theme);
        window.setTimeout(() => bodyEl.classList.remove('theme-transition'), 350);
    };

    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const nextTheme = bodyEl.classList.contains('light-theme') ? 'dark' : 'light';
        applyTheme(nextTheme);
        themeToggle.classList.remove('is-pressed');
        void themeToggle.offsetWidth;
        themeToggle.classList.add('is-pressed');
        window.setTimeout(() => themeToggle.classList.remove('is-pressed'), 480);
    });
}

function initProjectToggles() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
        const toggle = card.querySelector('.project-toggle');
        const swapGroups = Array.from(card.querySelectorAll('[data-swap]'));

        if (!toggle || swapGroups.length === 0) return;

        const measureGroup = (group) => {
            const summary = group.querySelector('[data-summary]');
            const detail = group.querySelector('[data-detail]');
            if (!summary || !detail) return;

            const wasDetail = detail.classList.contains('is-active');
            summary.classList.add('is-active');
            detail.classList.add('is-active');
            const maxHeight = Math.max(summary.offsetHeight, detail.offsetHeight);
            group.style.minHeight = `${Math.max(72, maxHeight)}px`;
            summary.classList.toggle('is-active', !wasDetail);
            detail.classList.toggle('is-active', wasDetail);
        };

        const measureAll = () => {
            swapGroups.forEach(measureGroup);
        };

        measureAll();

        toggle.addEventListener('click', () => {
            const showDetail = !card.classList.contains('is-detail');
            card.classList.toggle('is-detail', showDetail);
            swapGroups.forEach((group) => {
                const summary = group.querySelector('[data-summary]');
                const detail = group.querySelector('[data-detail]');
                if (!summary || !detail) return;
                summary.classList.toggle('is-active', !showDetail);
                detail.classList.toggle('is-active', showDetail);
            });
            toggle.textContent = showDetail ? toggle.dataset.labelLess : toggle.dataset.labelMore;
        });

        window.addEventListener('resize', measureAll);
    });
}

// Animate charts when visible
const skillObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const canvas = entry.target.querySelector('.skill-canvas');
                if (canvas) {
                    const targetPercent = parseInt(canvas.getAttribute('data-percent'), 10) || 0;
                    drawCircle(canvas, targetPercent);
                }
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

document.querySelectorAll('.skill-card').forEach((card) => {
    skillObserver.observe(card);
});

const skillModal = document.getElementById('skillModal');
const skillModalClose = document.getElementById('skillModalClose');
const skillModalEmoji = document.getElementById('skillModalEmoji');
const skillModalTitle = document.getElementById('skillModalTitle');
const skillModalSubtitle = document.getElementById('skillModalSubtitle');
const skillModalDetail = document.getElementById('skillModalDetail');
const skillModalCanvas = document.getElementById('skillModalCanvas');

function openSkillModal(card) {
    if (!skillModal) return;
    const title = card.querySelector('h3')?.textContent || '';
    const subtitle = card.querySelector('p')?.textContent || '';
    const detail = card.querySelector('.skill-detail p')?.textContent || '';
    const emoji = card.querySelector('.skill-emoji')?.textContent || '';
    const percent = parseInt(card.querySelector('.skill-canvas')?.getAttribute('data-percent'), 10) || 0;

    skillModalEmoji.textContent = emoji;
    skillModalTitle.textContent = title;
    skillModalSubtitle.textContent = subtitle;
    skillModalDetail.textContent = detail;

    const ctx = skillModalCanvas.getContext('2d');
    ctx.clearRect(0, 0, skillModalCanvas.width, skillModalCanvas.height);

    skillModal.classList.add('is-open');
    skillModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    animateSkillChart(skillModalCanvas, percent, 2000);
}

function closeSkillModal() {
    if (!skillModal) return;
    skillModal.classList.remove('is-open');
    skillModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.querySelectorAll('.skill-card').forEach((card) => {
    card.addEventListener('click', () => openSkillModal(card));
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openSkillModal(card);
        }
    });
});

if (skillModal) {
    skillModal.addEventListener('click', (event) => {
        if (event.target === skillModal) {
            closeSkillModal();
        }
    });
}

if (skillModalClose) {
    skillModalClose.addEventListener('click', closeSkillModal);
}

function initScrollSections() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const sections = document.querySelectorAll('section');
    if (sections.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    sections.forEach((section, index) => {
        section.classList.add('scroll-section');

        gsap.fromTo(
            section,
            { opacity: 0.4, y: 60 },
            {
                opacity: 1,
                y: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    end: 'top 20%',
                    scrub: true
                }
            }
        );
    });

}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initProjectToggles();
    initScrollSections();
    initSectionWheelNavigation();
    document.body.classList.add('loaded');
});

window.addEventListener('resize', () => {
    if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
        initScrollSections();
    }
});

function initSectionWheelNavigation() {
    const sections = Array.from(document.querySelectorAll('section'));
    if (sections.length === 0) return;

    let isAutoScrolling = false;
    let wheelLocked = false;
    let scrollRaf = null;

    const getCurrentSectionIndex = () => {
        const scrollY = window.pageYOffset;
        let index = 0;
        sections.forEach((section, i) => {
            if (section.offsetTop <= scrollY + 10) {
                index = i;
            }
        });
        return index;
    };

    const canMoveNext = (section) => {
        const viewportBottom = window.pageYOffset + window.innerHeight;
        return viewportBottom >= section.offsetTop + section.offsetHeight - 2;
    };

    const canMovePrev = (section) => {
        return window.pageYOffset <= section.offsetTop + 2;
    };

    const animateScrollTo = (targetY, done) => {
        if (scrollRaf) {
            cancelAnimationFrame(scrollRaf);
        }
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const duration = 650;
        const startTime = performance.now();

        const easeOut = (t) => 1 - Math.pow(1 - t, 3);

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = easeOut(progress);
            const nextY = Math.round(startY + distance * eased);
            window.scrollTo(0, nextY);
            if (progress < 1) {
                scrollRaf = requestAnimationFrame(step);
            } else {
                window.scrollTo(0, targetY);
                scrollRaf = null;
                if (done) done();
            }
        };

        scrollRaf = requestAnimationFrame(step);
    };

    const scrollToSection = (index) => {
        if (!sections[index]) return;
        isAutoScrolling = true;
        const target = sections[index].offsetTop;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        animateScrollTo(target, () => {
            document.body.style.overflow = previousOverflow;
            isAutoScrolling = false;
        });
    };

    const onWheel = (event) => {
        if (window.innerWidth < 1024 || isAutoScrolling) return;
        const target = event.target;
        if (target.closest('.skill-modal')) return;
        if (wheelLocked) {
            event.preventDefault();
            return;
        }

        const currentIndex = getCurrentSectionIndex();
        const current = sections[currentIndex];
        if (!current) return;

        const isLong = current.offsetHeight > window.innerHeight + 20;

        if (event.deltaY > 0) {
            if (!isLong || canMoveNext(current)) {
                event.preventDefault();
                const nextIndex = Math.min(sections.length - 1, currentIndex + 1);
                if (nextIndex !== currentIndex) {
                    wheelLocked = true;
                    scrollToSection(nextIndex);
                    window.setTimeout(() => {
                        wheelLocked = false;
                    }, 820);
                }
            }
        } else if (event.deltaY < 0) {
            if (!isLong || canMovePrev(current)) {
                event.preventDefault();
                const prevIndex = Math.max(0, currentIndex - 1);
                if (prevIndex !== currentIndex) {
                    wheelLocked = true;
                    scrollToSection(prevIndex);
                    window.setTimeout(() => {
                        wheelLocked = false;
                    }, 820);
                }
            }
        }
    };

    window.addEventListener('wheel', onWheel, { passive: false });

}


// Subtle parallax for hero background
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
    }
});
