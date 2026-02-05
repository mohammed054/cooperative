import PageIntro from '../components/PageIntro';
import ScribbleButton from '../components/ScribbleButton';

const Process = () => {
  const steps = [
    {
      title: 'Scope & alignment',
      desc: 'We confirm goals, audiences, and technical requirements. You leave with a clear scope and a workable timeline.',
    },
    {
      title: 'Design & planning',
      desc: 'Systems, vendor coordination, and run-of-show are locked in with transparent approvals.',
    },
    {
      title: 'Build & rehearsal',
      desc: 'We load in, test every system, and rehearse critical cues before doors open.',
    },
    {
      title: 'Show control',
      desc: 'A dedicated producer runs the event so your team can focus on guests and stakeholders.',
    },
  ];

  const cadence = [
    'Weekly check-ins with stakeholders and venue teams',
    'Production schedule shared and updated in real time',
    'Single point of escalation for show-day decisions',
  ];

  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="Process"
        title="A disciplined process that keeps the room calm."
        description="We run every project with tight approvals, clear handoffs, and a focused crew. The goal is simple: keep the timeline clean and the experience premium."
      >
        <ScribbleButton to="/contact" className="btn-primary text-sm">
          Start a project
        </ScribbleButton>
      </PageIntro>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-3xl border border-border bg-surface-3 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">Step 0{index + 1}</p>
              <h2 className="mt-3 text-xl font-semibold text-ink">{step.title}</h2>
              <p className="mt-3 text-sm text-ink-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-3 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="eyebrow">Communication</p>
            <h2 className="mt-4 text-3xl font-semibold text-ink font-serif">No surprises, no loose ends.</h2>
            <p className="mt-4 text-base text-ink-muted">
              We keep your internal team, venue, and vendors aligned with a consistent cadence and clear documentation.
            </p>
          </div>
          <ul className="space-y-4 rounded-3xl border border-border bg-surface-2 p-6 text-sm text-ink">
            {cadence.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Process;
