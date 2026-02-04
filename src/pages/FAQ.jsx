import PageIntro from '../components/PageIntro';
import { faqItems } from '../data/siteData';

const FAQ = () => {
  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="FAQ"
        title="Answers to the questions we hear most."
        description="If you are planning a production and need a clear next step, start here."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="rounded-3xl border border-border bg-surface-3 p-6"
              >
                <summary className="cursor-pointer text-sm font-semibold text-ink">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm text-ink-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
