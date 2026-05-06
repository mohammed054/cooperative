import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clients, services } from '@/data/site';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-reveal', {
        opacity: 0,
        y: 34,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
        },
      });

      gsap.to('.about-image img', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-image',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-section section-light">
      <div className="page-gutter about-section__grid">
        <div className="about-copy">
          <div className="eyebrow about-reveal">
            <span />
            About GHAIM
          </div>
          <h2 className="about-reveal">Built for rooms where timing is reputation.</h2>
          <p className="about-reveal">
            GHAIM operates like a private command office for premium corporate events. We translate
            business intent into atmosphere, movement, protocol, and the exact service details that
            make complex moments feel effortless.
          </p>
          <p className="about-reveal">
            Our work is intentionally understated. The production should never compete with the
            people in the room. It should hold the room, protect the message, and give every guest
            the sense that every step was already considered.
          </p>
        </div>

        <div className="about-image about-reveal">
          <img
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&auto=format&fit=crop&q=84"
            alt="Corporate event audience facing a premium illuminated stage"
            loading="lazy"
          />
          <div className="image-caption">
            <span>Dubai</span>
            <strong>Investor Forum 2024</strong>
          </div>
        </div>
      </div>

      <div className="page-gutter service-grid" aria-label="GHAIM service pillars">
        {services.map((service, index) => (
          <motion.article
            className="service-card about-reveal"
            key={service.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>0{index + 1}</span>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
          </motion.article>
        ))}
      </div>

      <div className="client-marquee" aria-label="Selected clients">
        <div>
          {[...clients, ...clients].map((client, index) => (
            <span key={`${client}-${index}`}>{client}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
