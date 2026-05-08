import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processSteps, riskControls, stats } from '@/data/site';

gsap.registerPlugin(ScrollTrigger);

export function OperatingSystem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.system-reveal', {
        opacity: 0,
        y: 34,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="system" ref={sectionRef} className="system-section">
      <div className="page-gutter system-layout">
        <div className="system-copy">
          <div className="eyebrow eyebrow--light system-reveal">
            <span />
            Operating System
          </div>
          <h2 className="system-reveal">The premium layer is not decoration. It is control.</h2>
          <p className="system-reveal">
            High-budget events fail in the spaces between teams: transport, protocol, staging,
            hospitality, security, and executive time. GHAIM closes those gaps with one command
            blueprint before the first supplier is briefed.
          </p>

          <div className="system-metrics system-reveal" aria-label="Operating proof points">
            {stats.slice(0, 3).map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="system-panel system-reveal"
          whileHover={{ y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="system-panel__top">
            <span>Command Blueprint</span>
            <strong>Live-room readiness</strong>
          </div>

          <div className="system-checklist">
            {riskControls.map((control) => (
              <span key={control}>{control}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="page-gutter process-grid" aria-label="GHAIM delivery process">
        {processSteps.map((item) => (
          <article className="process-card system-reveal" key={item.step}>
            <span>{item.step}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
