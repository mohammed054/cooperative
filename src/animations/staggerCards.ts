import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Stagger Cards Reveal ─────────────────────────────────
export const staggerCards = (
  selector: string,
  containerSelector: string,
  options?: gsap.TweenVars,
) => {
  return gsap.from(selector, {
    opacity: 0,
    y: 40,
    stagger: 0.14,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: containerSelector,
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    ...options,
  });
};

// ── Section Reveal ────────────────────────────────────────
export const sectionReveal = (
  trigger: string | Element,
  targets: string | Element | Element[],
  options?: gsap.TweenVars,
) => {
  return gsap.from(targets, {
    opacity: 0,
    y: 36,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger,
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
    ...options,
  });
};

// ── Parallax Layer ────────────────────────────────────────
export const parallaxLayer = (
  selector: string,
  yOffset: number = 80,
) => {
  return gsap.to(selector, {
    yPercent: yOffset,
    ease: 'none',
    scrollTrigger: {
      trigger: selector,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// ── Hero Scroll Fade ──────────────────────────────────────
export const heroScrollFade = (selector: string) => {
  return gsap.to(selector, {
    opacity: 0,
    y: -32,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '40% top',
      scrub: 0.6,
    },
  });
};
