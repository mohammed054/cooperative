import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clients, stats } from '@/data/site';

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
        poster="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&auto=format&fit=crop&q=85"
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
            Luxury Corporate Event Management
          </div>
          <h1>
            Designing executive moments that move markets, reputations, and rooms.
          </h1>
          <p>
            GHAIM builds high-stakes corporate events for boards, founders, sovereign guests, and
            global brands that cannot afford visible friction.
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
            <span>Command Standard</span>
            <strong>Protocol, production, hospitality.</strong>
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
