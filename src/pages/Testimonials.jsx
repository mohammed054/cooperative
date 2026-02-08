import PageIntro from '../components/PageIntro'
import TestimonialsSection from '../components/TestimonialsSection'
import FinalCta from '../components/FinalCta'

const Testimonials = () => {
  return (
    <div className="bg-surface-3">
      <PageIntro
        eyebrow="Testimonials"
        title="Feedback from teams who value precision."
        description="Short notes from clients who needed calm execution and a crew that stays ahead of the timeline."
      />
      <TestimonialsSection
        title="Calm execution, clean timelines."
        intro="We keep the communication clear and the production controlled - so your stakeholders can focus on the experience."
        showLink={false}
      />
      <FinalCta />
    </div>
  )
}

export default Testimonials
