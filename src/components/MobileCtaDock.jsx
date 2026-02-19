import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import ScribbleButton from './ScribbleButton'

const HIDDEN_PATHS = new Set(['/', '/contact', '/privacy', '/terms'])

const MobileCtaDock = () => {
  const shouldReduceMotion = useReducedMotion()
  const location = useLocation()

  if (HIDDEN_PATHS.has(location.pathname)) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="pointer-events-auto rounded-2xl border border-black/[0.08] bg-[#f8f4ee]/95 p-2 shadow-[0_18px_44px_rgba(12,12,12,0.22)] backdrop-blur-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <ScribbleButton
              href="tel:+97142345678"
              variant="outline"
              tone="dark"
              size="sm"
              className="w-full justify-center"
              showArrow={false}
              analyticsLabel="mobile-dock-call-now"
            >
              Call now
            </ScribbleButton>
            <ScribbleButton
              to="/contact"
              variant="primary"
              tone="dark"
              size="sm"
              className="w-full justify-center"
              analyticsLabel="mobile-dock-request-proposal"
            >
              Request proposal
            </ScribbleButton>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MobileCtaDock
