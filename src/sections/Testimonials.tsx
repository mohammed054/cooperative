import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clients, testimonials } from '@/data/site';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.trust-reveal', {
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
    <section id="testimonials" ref={sectionRef} className="trust-section">
      <div className="page-gutter trust-layout">
        <div className="trust-copy">
          <div className="eyebrow eyebrow--light trust-reveal">
            <span />
            Client Trust
          </div>
          <h2 className="trust-reveal">Chosen when the audience includes the people who decide what happens next.</h2>
          <p className="trust-reveal">
            The work is confidential by nature, but the pattern is consistent: clients return when
            the room must feel composed, decisive, and completely under control.
          </p>
          <div className="trust-logos trust-reveal">
            {clients.slice(0, 6).map((client) => (
              <span key={client}>{client}</span>
            ))}
          </div>
        </div>

        <div className="testimonial-stack">
          {testimonials.map((testimonial, index) => (
            <motion.article
              className="testimonial-card trust-reveal"
              key={testimonial.author}
              whileHover={{ x: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>0{index + 1}</span>
              <blockquote>{testimonial.quote}</blockquote>
              <footer>
                <strong>{testimonial.author}</strong>
                <small>
                  {testimonial.title}, {testimonial.company}
                </small>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
