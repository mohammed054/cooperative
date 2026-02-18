import { useEffect, useRef, useState } from 'react'

export const useScrollSnap = sectionIds => {
  const [currentSection, setCurrentSection] = useState(0)
  const isScrolling = useRef(false)

  useEffect(() => {
    const handleWheel = e => {
      if (isScrolling.current) return

      // Don't hijack scroll when user is in the horizontal scroll services section
      const servicesSection = document.getElementById('services')
      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect()
        // If services section is in viewport (sticky section is active)
        if (rect.top <= 0 && rect.bottom > window.innerHeight) {
          return // Let the horizontal scroll section handle it
        }
      }

      e.preventDefault()

      const direction = e.deltaY > 0 ? 1 : -1
      const nextSection = Math.max(
        0,
        Math.min(sectionIds.length - 1, currentSection + direction)
      )

      if (nextSection !== currentSection) {
        isScrolling.current = true
        setCurrentSection(nextSection)

        const element = document.getElementById(sectionIds[nextSection])
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })

          setTimeout(() => {
            isScrolling.current = false
          }, 1000)
        }
      }
    }

    const handleKeyDown = e => {
      if (isScrolling.current) return

      let direction = 0
      if (e.key === 'ArrowDown' || e.key === 'PageDown') direction = 1
      if (e.key === 'ArrowUp' || e.key === 'PageUp') direction = -1

      if (direction !== 0) {
        e.preventDefault()
        const nextSection = Math.max(
          0,
          Math.min(sectionIds.length - 1, currentSection + direction)
        )

        if (nextSection !== currentSection) {
          isScrolling.current = true
          setCurrentSection(nextSection)

          const element = document.getElementById(sectionIds[nextSection])
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })

            setTimeout(() => {
              isScrolling.current = false
            }, 1000)
          }
        }
      }
    }

    // Add touch support for mobile
    let touchStartY = 0
    let touchEndY = 0

    const handleTouchStart = e => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = e => {
      if (isScrolling.current) return

      // Don't hijack touch scroll when user is in the horizontal scroll services section
      const servicesSection = document.getElementById('services')
      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect()
        if (rect.top <= 0 && rect.bottom > window.innerHeight) {
          return // Let the horizontal scroll section handle it
        }
      }

      touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY - touchEndY
      const threshold = 50 // Minimum swipe distance

      if (Math.abs(diff) > threshold) {
        const direction = diff > 0 ? 1 : -1
        const nextSection = Math.max(
          0,
          Math.min(sectionIds.length - 1, currentSection + direction)
        )

        if (nextSection !== currentSection) {
          isScrolling.current = true
          setCurrentSection(nextSection)

          const element = document.getElementById(sectionIds[nextSection])
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })

            setTimeout(() => {
              isScrolling.current = false
            }, 1000)
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Update current section on manual scroll
    const handleScroll = () => {
      if (isScrolling.current) return

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      for (let i = 0; i < sectionIds.length; i++) {
        const element = document.getElementById(sectionIds[i])
        if (element) {
          const elementTop = element.offsetTop
          const elementBottom = elementTop + windowHeight

          if (
            scrollPosition >= elementTop - windowHeight / 2 &&
            scrollPosition < elementBottom - windowHeight / 2
          ) {
            setCurrentSection(i)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [currentSection, sectionIds])

  return currentSection
}
