import React from 'react'
import { Link } from 'react-router-dom'

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <main className="relative min-h-[70vh] bg-gradient-to-b from-[#121418] via-[#161a21] to-[#0f1013] text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center px-6 py-20 sm:px-8 lg:px-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/42">
            System message
          </p>
          <h1 className="mt-4 max-w-[18ch] font-serif text-[clamp(1.8rem,5vw,3rem)] leading-[1.08] tracking-[-0.02em]">
            Something interrupted the page flow.
          </h1>
          <p className="mt-4 max-w-[50ch] text-sm leading-relaxed text-white/62 sm:text-base">
            The interface encountered an unexpected issue. You can reload now or
            return to the homepage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-white/92"
            >
              Reload page
            </button>
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white/86 transition-colors hover:border-white/55 hover:text-white"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </main>
    )
  }
}

export default AppErrorBoundary
