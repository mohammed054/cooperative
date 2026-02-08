import { useEffect, useRef } from 'react'

export const useFocusTrap = isActive => {
  const containerRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Store the currently focused element
    previousFocusRef.current = document.activeElement

    // Focus the first element
    firstElement.focus()

    const handleTabKey = e => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    const handleEscapeKey = e => {
      if (e.key === 'Escape') {
        e.preventDefault()
        // Return focus to the trigger element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      container.removeEventListener('keydown', handleTabKey)
      document.removeEventListener('keydown', handleEscapeKey)

      // Return focus to the original element when trap is deactivated
      if (
        previousFocusRef.current &&
        document.activeElement === document.body
      ) {
        previousFocusRef.current.focus()
      }
    }
  }, [isActive])

  return { containerRef, previousFocusRef }
}
