import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clients, principles, services } from '@/data/site';

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
          <h2 className="about-reveal">Built like a private command office, not an event supplier.</h2>
          <p className="about-reveal">
            Consequential rooms need more than beautiful production. They need a senior operating
            layer that can translate business intent into timing, movement, service, protocol, and
            calm decisions under pressure.
          </p>
          <p className="about-reveal">
            GHAIM sits above creative, production, protocol, hospitality, vendors, and venue teams
            so the client has one senior standard from first conversation to post-event debrief.
          </p>
        </div>

        <div className="about-image about-reveal">
          <img
            src={`${import.meta.env.BASE_URL}event1.jpg`}
            alt="Premium corporate event setup with dramatic lighting and a formal audience"
            loading="lazy"
          />
          <div className="image-caption">
            <span>Command View</span>
            <strong>Executive Forum</strong>
          </div>
        </div>
      </div>

      <div className="page-gutter principles-grid" aria-label="GHAIM operating principles">
        {principles.map((principle) => (
          <article className="principle-card about-reveal" key={principle.title}>
            <strong>{principle.signal}</strong>
            <h3>{principle.title}</h3>
            <p>{principle.body}</p>
          </article>
        ))}
      </div>

      <div className="page-gutter service-grid" aria-label="GHAIM service pillars">
        {services.map((service) => (
          <motion.article
            className="service-card about-reveal"
            key={service.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{service.kicker}</span>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
            <ul>
              {service.deliverables.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
