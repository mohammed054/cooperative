import { motion, useReducedMotion } from 'framer-motion'

const PageIntro = ({
  eyebrow,
  title,
  description,
  align = 'left',
  rhythm = 'hero',
  bridge = 'soft',
  className = '',
  contentClassName = '',
  children,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  const variants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    },
  }

  return (
    <section
      className={[
        'relative cinematic-scene',
        `scene-rhythm-${rhythm}`,
        bridge !== 'none' ? 'scene-bridge' : '',
        bridge !== 'none' ? `scene-bridge-${bridge}` : '',
        className,
      ].join(' ')}
    >
      <div
        className={[
          'mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:px-8',
          'pt-10 pb-3 sm:pt-12 sm:pb-5 lg:pt-16 lg:pb-8',
          alignment,
          contentClassName,
        ].join(' ')}
      >
        {eyebrow && (
          <motion.p
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="show"
            style={{
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#aaa',
              fontWeight: 500,
            }}
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          variants={variants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="show"
          className="font-serif"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 600,
            color: '#1c1c1c',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="show"
            style={{
              maxWidth: '600px',
              fontSize: 'clamp(14px, 1.5vw, 17px)',
              color: '#888',
              lineHeight: 1.6,
            }}
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="show"
            className="mt-2"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default PageIntro
