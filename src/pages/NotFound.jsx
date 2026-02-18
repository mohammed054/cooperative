import ScribbleButton from '../components/ScribbleButton'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const NotFound = () => {
  return (
    <CinematicPage>
      <CinematicScene
        rhythm="anchor"
        bridge="warm"
        className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 sm:px-6 lg:px-8"
      >
        <p className="eyebrow">404</p>
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
          This page does not exist.
        </h1>
        <p className="text-base text-ink-muted">
          The link may be outdated or the page has moved. Use the links below to
          get back on track.
        </p>
        <div className="flex flex-wrap gap-3">
          <ScribbleButton to="/" className="btn-primary text-sm">
            Back to home
          </ScribbleButton>
          <ScribbleButton to="/contact" className="btn-secondary text-sm">
            Contact us
          </ScribbleButton>
        </div>
      </CinematicScene>
    </CinematicPage>
  )
}

export default NotFound
