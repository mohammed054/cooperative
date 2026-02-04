const PageIntro = ({ eyebrow, title, description, align = 'left', children }) => {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <section className="border-b border-border bg-surface">
      <div className={`mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8 ${alignment}`}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl font-serif">
          {title}
        </h1>
        {description && (
          <p className="max-w-3xl text-base text-ink-muted sm:text-lg">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
};

export default PageIntro;
