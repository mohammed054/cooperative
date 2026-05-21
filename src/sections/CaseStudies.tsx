import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { caseStudies, type CaseStudy } from '@/data/site';

gsap.registerPlugin(ScrollTrigger);

function StudyMeta({ study }: { study: CaseStudy }) {
  return (
    <div className="study-meta">
      <span>{study.category}</span>
      <span>{study.location}</span>
      <span>{study.year}</span>
    </div>
  );
}

function Lightbox({ study, onClose }: { study: CaseStudy | null; onClose: () => void }) {
  useEffect(() => {
    if (!study) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [study, onClose]);

  return (
    <AnimatePresence>
      {study && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${study.title} case study`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="lightbox__panel"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="lightbox__image">
              <img src={study.image} alt={study.title} />
            </div>
            <div className="lightbox__content">
              <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close case study">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </button>
              <StudyMeta study={study} />
              <h3>{study.title}</h3>
              <p>{study.summary}</p>

              <div className="lightbox__proof">
                <strong>{study.metric}</strong>
                <span>{study.impact}</span>
              </div>

              <div className="case-detail-grid">
                <div>
                  <span>Timeline</span>
                  <p>{study.timeline}</p>
                </div>
                <div>
                  <span>Private Note</span>
                  <p>{study.privateNote}</p>
                </div>
              </div>

              <div className="case-list">
                <span>Scope</span>
                <ul>
                  {study.scope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <Link to={{ pathname: '/', hash: '#contact' }} className="text-cta" onClick={onClose}>
                Discuss a Similar Brief
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
                  <path d="M1 5h16M12 1l5 4-5 4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(caseStudies.map((study) => study.category)))],
    [],
  );

  const visibleStudies = useMemo(() => {
    if (activeCategory === 'All') return caseStudies;
    return caseStudies.filter((study) => study.category === activeCategory);
  }, [activeCategory]);

  const featuredStudy = visibleStudies[0] ?? caseStudies[0];
  const galleryStudies = visibleStudies.slice(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.work-reveal', {
        opacity: 0,
        y: 36,
        duration: 0.92,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
        },
      });

      gsap.utils.toArray<HTMLElement>('.study-card').forEach((card) => {
        const image = card.querySelector('img');
        if (!image) return;

        gsap.to(image, {
          yPercent: -7,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Lightbox study={selectedStudy} onClose={() => setSelectedStudy(null)} />

      <section id="work" ref={sectionRef} className="work-section section-light">
        <div className="page-gutter work-header">
          <div>
            <div className="eyebrow work-reveal">
              <span />
              Selected Work
            </div>
            <h2 className="work-reveal">Evidence with enough detail to trust the operation.</h2>
          </div>
          <p className="work-reveal">
            These engagements are selected for the decisions behind them: timing, guest flow,
            protocol, risk, vendor ownership, and executive outcomes.
          </p>
        </div>

        <div className="page-gutter work-filters work-reveal" aria-label="Filter case studies">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={category === activeCategory ? 'is-active' : ''}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="page-gutter">
          <motion.button
            type="button"
            className="featured-study work-reveal"
            onClick={() => setSelectedStudy(featuredStudy)}
            whileHover="hover"
            initial="rest"
            animate="rest"
          >
            <img src={featuredStudy.image} alt={featuredStudy.title} loading="eager" />
            <div className="featured-study__shade" aria-hidden />
            <div className="featured-study__badge" aria-label="Featured case signal">
              <span>Signature Case</span>
              <strong>{featuredStudy.timeline}</strong>
            </div>
            <div className="featured-study__content">
              <StudyMeta study={featuredStudy} />
              <motion.h3 variants={{ rest: { y: 0 }, hover: { y: -6 } }}>{featuredStudy.title}</motion.h3>
              <p>{featuredStudy.summary}</p>
              <div className="featured-study__proof">
                <strong>{featuredStudy.metric}</strong>
                <span>{featuredStudy.impact}</span>
              </div>
              <span className="text-cta text-cta--light">
                Open Case
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
                  <path d="M1 5h16M12 1l5 4-5 4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </motion.button>

          <div className="study-grid" aria-label="More selected case studies">
            {galleryStudies.map((study) => (
              <motion.button
                key={study.id}
                type="button"
                className="study-card work-reveal"
                onClick={() => setSelectedStudy(study)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="study-card__image">
                  <img src={study.image} alt={study.title} loading="lazy" />
                </div>
                <div className="study-card__body">
                  <StudyMeta study={study} />
                  <h3>{study.title}</h3>
                  <p>{study.summary}</p>
                  <strong>{study.metric}</strong>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
