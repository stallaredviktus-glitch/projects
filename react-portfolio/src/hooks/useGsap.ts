import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsap() {
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    return () => {
      contextRef.current?.revert();
    };
  }, []);

  const createContext = (scope: Element | string | null | undefined) => {
    contextRef.current = gsap.context(() => {}, scope ?? undefined);
    return contextRef.current;
  };

  return { gsap, ScrollTrigger, createContext };
}

export function useRevealAnimation(
  ref: React.RefObject<HTMLElement>,
  options?: {
    y?: number;
    opacity?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
    start?: string;
  }
) {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const elements = ref.current?.querySelectorAll('.reveal-item') ?? [ref.current];

      gsap.fromTo(
        elements,
        {
          y: options?.y ?? 60,
          opacity: options?.opacity ?? 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: options?.duration ?? 1,
          delay: options?.delay ?? 0,
          stagger: options?.stagger ?? 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: options?.start ?? 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [ref, options]);
}

export function useParallax(
  ref: React.RefObject<HTMLElement>,
  speed: number = 0.5
) {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [ref, speed]);
}
