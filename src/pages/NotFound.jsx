import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-surface-3">
      <section className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8">
        <p className="eyebrow">404</p>
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
          This page does not exist.
        </h1>
        <p className="text-base text-ink-muted">
          The link may be outdated or the page has moved. Use the links below to get back on track.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="btn-primary text-sm">
            Back to home
          </Link>
          <Link to="/contact" className="btn-secondary text-sm">
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
