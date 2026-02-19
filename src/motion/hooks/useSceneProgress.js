import { useScroll } from 'framer-motion'

const DEFAULT_OFFSET = ['start end', 'end start']

export const useSceneProgress = (targetRef, options = {}) => {
  const { offset = DEFAULT_OFFSET } = options

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset,
  })

  return { scrollYProgress }
}

export default useSceneProgress
