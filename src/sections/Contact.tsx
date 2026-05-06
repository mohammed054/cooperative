import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brand } from '@/data/site';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        opacity: 0,
        y: 36,
        duration: 0.95,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="contact-section__media" aria-hidden>
        <img
          src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&auto=format&fit=crop&q=84"
          alt=""
          loading="lazy"
        />
      </div>
      <div className="contact-section__shade" aria-hidden />

      <div className="page-gutter contact-layout">
        <div className="contact-copy">
          <div className="eyebrow eyebrow--light contact-reveal">
            <span />
            Begin the Conversation
          </div>
          <h2 className="contact-reveal">Bring us the ambition. We will build the room around it.</h2>
          <p className="contact-reveal">
            For board summits, investor forums, galas, launches, and private corporate commissions,
            the first briefing is intentionally direct.
          </p>
        </div>

        <div className="contact-panel contact-reveal">
          <div className="contact-panel__header">
            <span>Private Briefing Desk</span>
            <strong>Dubai, UAE</strong>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="contact-form">
              <label>
                <span>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </label>
              <motion.button
                type="submit"
                className="button button--gold button--full"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Request Proposal
              </motion.button>
            </form>
          ) : (
            <motion.div
              className="contact-success"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <strong>Brief received.</strong>
              <span>We will be in touch personally.</span>
            </motion.div>
          )}

          <div className="contact-details">
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <a href="tel:+97140000000">{brand.phone}</a>
            <span>{brand.address}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
