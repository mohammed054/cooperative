import PageIntro from '../components/PageIntro'
import TestimonialsSection from '../components/TestimonialsSection'
import FinalCta from '../components/FinalCta'
import SceneSignalBand from '../components/SceneSignalBand'
import SceneMobileStack from '../components/SceneMobileStack'
import { CinematicPage } from '../components/CinematicPage'

const Testimonials = () => {
  const trustSignals = [
    {
      label: 'Pattern',
      title: 'Communication stays clear',
      description:
        'Clients consistently mention proactive updates and controlled handoffs.',
    },
    {
      label: 'Pattern',
      title: 'Setups arrive room-ready',
      description:
        'Technical and rental packages are tested, labeled, and prepared before deployment.',
    },
    {
      label: 'Pattern',
      title: 'Crews stay calm on show day',
      description:
        'High-pressure environments remain composed when execution ownership is clear.',
    },
  ]

  return (
    <CinematicPage>
      <PageIntro
        eyebrow="Testimonials"
        title="Feedback from teams who value precision."
        description="Short notes from clients who needed calm execution and a crew that stays ahead of the timeline."
        bridge="warm"
      />
      <SceneSignalBand
        eyebrow="Trust signal"
        title="Confidence compounds when operations remain predictable."
        description="These client notes reflect repeatable behaviors, not one-off outcomes."
      />
      <TestimonialsSection
        title="Calm execution, clean timelines."
        intro="We keep the communication clear and the production controlled - so your stakeholders can focus on the experience."
        showLink={false}
      />
      <SceneMobileStack
        eyebrow="Observed patterns"
        title="What clients repeatedly experience."
        description="A compact mobile summary of the signals behind long-term trust."
        cards={trustSignals}
      />
      <FinalCta />
    </CinematicPage>
  )
}

export default Testimonials
