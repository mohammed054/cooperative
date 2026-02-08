const PageIntro = ({
  eyebrow,
  title,
  description,
  align = 'left',
  children,
}) => {
  const alignment =
    align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <section
      className="page-intro border-b border-border bg-surface"
      style={{ contain: 'layout style' }}
    >
      <div
        className={`page-intro-content mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8 ${alignment}`}
        style={{ contain: 'layout style' }}
      >
        {eyebrow && (
          <p className="eyebrow" style={{ contain: 'layout style' }}>
            {eyebrow}
          </p>
        )}
        <h1
          className="text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl font-serif"
          style={{ contain: 'layout style' }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="max-w-3xl text-base text-ink-muted sm:text-lg"
            style={{ contain: 'layout style' }}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}

export default PageIntro
