import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brand, clients, stats } from '@/data/site';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!mediaRef.current) return;

      gsap.to(mediaRef.current, {
        scale: 1.08,
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="hero-scene">
      <video
        ref={mediaRef}
        className="hero-scene__media"
        autoPlay
        muted
        loop
        playsInline
        poster={`${import.meta.env.BASE_URL}event1.jpg`}
      >
        <source src={`${import.meta.env.BASE_URL}background.mp4`} type="video/mp4" />
      </video>
      <div className="hero-scene__shade" aria-hidden />

      <div className="hero-scene__content page-gutter">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="eyebrow eyebrow--light">
            <span />
            {brand.tagline}
          </div>
          <h1>Private command for events where reputation is in the room.</h1>
          <p>
            GHAIM designs and operates executive forums, galas, launches, and private commissions
            for clients who need the experience to feel effortless because the stakes are not.
          </p>
          <div className="hero-actions">
            <Link to={{ pathname: '/', hash: '#work' }} className="button button--gold">
              View Selected Work
            </Link>
            <Link to={{ pathname: '/', hash: '#contact' }} className="button button--glass">
              Request a Private Briefing
            </Link>
          </div>
        </motion.div>

        <motion.aside
          className="hero-brief"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          aria-label="GHAIM performance metrics"
        >
          <div className="hero-brief__top">
            <span>Current Command Standard</span>
            <strong>Protocol, production, hospitality, and risk in one operating layer.</strong>
          </div>
          <div className="hero-stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>

      <div className="hero-client-strip" aria-label="Trusted by selected clients">
        {clients.slice(0, 6).map((client) => (
          <span key={client}>{client}</span>
        ))}
      </div>

      <div className="scroll-cue" aria-hidden>
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
