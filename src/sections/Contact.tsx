import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brand } from '@/data/site';

gsap.registerPlugin(ScrollTrigger);

type BriefForm = {
  name: string;
  email: string;
  company: string;
  eventType: string;
  timeline: string;
  guests: string;
  budget: string;
  note: string;
};

const initialForm: BriefForm = {
  name: '',
  email: '',
  company: '',
  eventType: 'Executive forum',
  timeline: '',
  guests: '',
  budget: 'AED 250k - 500k',
  note: '',
};

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<BriefForm>(initialForm);
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

  const mailtoHref = useMemo(() => {
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Company: ${form.company}`,
      `Event type: ${form.eventType}`,
      `Timeline: ${form.timeline}`,
      `Guests: ${form.guests}`,
      `Budget: ${form.budget}`,
      '',
      form.note,
    ].join('\n');

    return `mailto:${brand.email}?subject=${encodeURIComponent('Private event briefing')}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const updateField = (field: keyof BriefForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email.trim() || !form.name.trim()) return;
    setSent(true);
  };

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="contact-section__media" aria-hidden>
        <img src={`${import.meta.env.BASE_URL}event1.jpg`} alt="" loading="lazy" />
      </div>
      <div className="contact-section__shade" aria-hidden />

      <div className="page-gutter contact-layout">
        <div className="contact-copy">
          <div className="eyebrow eyebrow--light contact-reveal">
            <span />
            Begin the Conversation
          </div>
          <h2 className="contact-reveal">Bring the stakes. We will build the room around them.</h2>
          <p className="contact-reveal">
            A serious brief needs more than an email capture. Share the first facts and the private
            briefing desk can respond with the right senior lead, timeline, and next questions.
          </p>
          <div className="contact-routes contact-reveal">
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <a href={`tel:${brand.tel}`}>{brand.phone}</a>
            <span>{brand.address}</span>
          </div>
          <div className="contact-assurance contact-reveal" aria-label="Briefing assurances">
            <span>Senior lead assigned</span>
            <span>Private response path</span>
            <span>No public intake queue</span>
          </div>
        </div>

        <div className="contact-panel contact-reveal">
          <div className="contact-panel__header">
            <span>Private Briefing Desk</span>
            <strong>Response within 1 business day</strong>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-grid">
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Your name"
                    required
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="name@company.com"
                    required
                  />
                </label>
              </div>

              <label>
                <span>Company or family office</span>
                <input
                  type="text"
                  value={form.company}
                  onChange={(event) => updateField('company', event.target.value)}
                  placeholder="Organisation"
                />
              </label>

              <div className="form-grid">
                <label>
                  <span>Event type</span>
                  <select value={form.eventType} onChange={(event) => updateField('eventType', event.target.value)}>
                    <option>Executive forum</option>
                    <option>Leadership summit</option>
                    <option>Gala or awards</option>
                    <option>Brand experience</option>
                    <option>Private commission</option>
                  </select>
                </label>
                <label>
                  <span>Budget range</span>
                  <select value={form.budget} onChange={(event) => updateField('budget', event.target.value)}>
                    <option>AED 250k - 500k</option>
                    <option>AED 500k - 1m</option>
                    <option>AED 1m - 3m</option>
                    <option>AED 3m+</option>
                  </select>
                </label>
              </div>

              <div className="form-grid">
                <label>
                  <span>Timeline</span>
                  <input
                    type="text"
                    value={form.timeline}
                    onChange={(event) => updateField('timeline', event.target.value)}
                    placeholder="Month / quarter"
                  />
                </label>
                <label>
                  <span>Guests</span>
                  <input
                    type="text"
                    value={form.guests}
                    onChange={(event) => updateField('guests', event.target.value)}
                    placeholder="Approx. count"
                  />
                </label>
              </div>

              <label>
                <span>What must the event achieve?</span>
                <textarea
                  value={form.note}
                  onChange={(event) => updateField('note', event.target.value)}
                  placeholder="Audience, objective, location, sensitivities, or anything that cannot go wrong."
                  rows={4}
                />
              </label>

              <motion.button
                type="submit"
                className="button button--gold button--full"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Prepare Briefing
              </motion.button>
            </form>
          ) : (
            <motion.div
              className="contact-success"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <strong>Brief captured.</strong>
              <span>Open your email client to send the structured brief directly to GHAIM.</span>
              <a href={mailtoHref} className="button button--gold button--full">
                Send Brief by Email
              </a>
              <button type="button" className="text-cta" onClick={() => setSent(false)}>
                Edit Brief
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
