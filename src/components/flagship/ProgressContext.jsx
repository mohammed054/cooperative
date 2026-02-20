import { createContext, useContext } from 'react'
import {
  useMotionValue,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'

const ProgressContext = createContext(null)

const useProgress = () => {
  const ctx = useContext(ProgressContext)
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return ctx
}

const useProgressValue = () => {
  const { progress } = useProgress()
  return progress
}

const useProgressTransform = (inputRange, outputRange) => {
  const { progress } = useProgress()
  return useTransform(progress, inputRange, outputRange)
}

const useProgressEvent = callback => {
  const { progress } = useProgress()
  useMotionValueEvent(progress, 'change', callback)
}

const ProgressProvider = ({ progress, reduced, children }) => {
  return (
    <ProgressContext.Provider value={{ progress, reduced }}>
      {children}
    </ProgressContext.Provider>
  )
}

export {
  ProgressProvider,
  useProgress,
  useProgressValue,
  useProgressTransform,
  useProgressEvent,
}
