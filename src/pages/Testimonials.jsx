import PageIntro from '../components/PageIntro'
import TestimonialsSection from '../components/TestimonialsSection'
import FinalCta from '../components/FinalCta'
import { CinematicPage } from '../components/CinematicPage'

const Testimonials = () => {
  return (
    <CinematicPage>
      <PageIntro
        eyebrow="Testimonials"
        title="Feedback from teams who value precision."
        description="Short notes from clients who needed calm execution and a crew that stays ahead of the timeline."
        bridge="warm"
      />
      <TestimonialsSection
        title="Calm execution, clean timelines."
        intro="We keep the communication clear and the production controlled - so your stakeholders can focus on the experience."
        showLink={false}
      />
      <FinalCta />
    </CinematicPage>
  )
}

export default Testimonials
