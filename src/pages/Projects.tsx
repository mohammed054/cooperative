import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { caseStudies, clients } from '@/data/site';
import { Footer } from '@/sections/Footer';

export function Projects() {
  return (
    <>
      <main className="projects-page">
        <section className="projects-hero page-gutter">
          <div className="eyebrow">
            <span />
            Portfolio
          </div>
          <h1>Selected engagements with quiet scale and visible consequence.</h1>
          <p>
            Every engagement is framed through the operational scope, timeline, outcome, and
            delivery responsibilities that sit beneath the visible experience.
          </p>
        </section>

        <section className="project-index page-gutter" aria-label="Project index">
          {caseStudies.map((project, index) => (
            <motion.article
              className="project-row"
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="project-row__number">{String(index + 1).padStart(2, '0')}</span>
              <div className="project-row__image">
                <img src={project.image} alt={project.title} loading={index === 0 ? 'eager' : 'lazy'} />
              </div>
              <div className="project-row__content">
                <div className="study-meta">
                  <span>{project.category}</span>
                  <span>{project.location}</span>
                  <span>{project.year}</span>
                </div>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                <strong>{project.impact}</strong>
                <div className="project-row__scope">
                  {project.scope.slice(0, 4).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        <section className="projects-trust page-gutter">
          <div>
            <span>Trusted by</span>
            <div>
              {clients.map((client) => (
                <strong key={client}>{client}</strong>
              ))}
            </div>
          </div>
          <Link to={{ pathname: '/', hash: '#contact' }} className="button button--dark">
            Request Proposal
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
