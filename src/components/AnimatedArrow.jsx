import React, { useRef, useEffect, useState } from 'react'

const AnimatedArrow = () => {
  const pathRef = useRef(null)
  const [pathLength, setPathLength] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength()
      setPathLength(length)
      pathRef.current.style.strokeDasharray = length
      pathRef.current.style.strokeDashoffset = length
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => setIsVisible(entry.isIntersecting))
      },
      { threshold: 0.1 }
    )

    if (pathRef.current) observer.observe(pathRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="160"
      height="180"
      viewBox="0 0 238 272"
      className="hidden sm:block absolute left-1/2 -translate-x-1/2 -translate-y-20 z-50"
    >
      <g>
        <path
          ref={pathRef}
          d="M 207.50 258.99 C206.45,263.76 203.02,262.37 202.99,257.17 C202.97,254.18 198.25,245.26 195.09,242.24 C191.70,239.00 191.29,238.00 193.37,238.00 C196.08,238.00 200.30,242.46 203.01,248.18 C206.21,254.95 207.00,254.20 207.00,244.38 C207.00,227.48 202.52,204.61 196.99,193.35 C192.80,184.80 183.08,175.88 172.57,170.94 C168.13,168.85 163.15,166.87 161.50,166.55 L 158.50 165.96 L 156.11 177.23 C153.29,190.49 151.09,195.37 146.71,198.04 C141.97,200.92 137.08,200.57 132.12,196.97 C122.36,189.90 120.41,180.16 127.21,172.41 C131.90,167.07 139.14,163.83 147.99,163.11 L 155.50 162.50 L 156.30 156.00 C157.20,148.71 156.49,131.11 154.87,120.50 C153.26,109.96 148.48,96.05 144.19,89.41 C136.45,77.45 126.02,70.72 113.23,69.44 L 107.50 68.86 L 110.20 70.98 C113.95,73.92 117.00,79.18 117.00,82.72 C117.00,86.61 113.15,92.25 109.99,93.01 C105.98,93.97 103.19,92.99 99.51,89.31 C93.99,83.79 92.65,76.73 96.06,71.14 C97.19,69.29 97.97,67.66 97.80,67.51 C96.42,66.31 86.11,61.84 68.90,55.00 C29.29,39.25 15.22,31.08 9.91,20.79 C7.55,16.20 7.28,8.00 9.50,8.00 C10.63,8.00 11.00,9.21 11.00,12.86 C11.00,17.13 11.50,18.29 15.13,22.41 C23.40,31.80 32.85,36.96 67.53,51.01 C80.77,56.38 93.93,61.94 96.77,63.38 C100.85,65.45 103.38,66.00 108.79,66.00 C121.15,66.00 133.52,71.24 140.87,79.58 C145.91,85.32 152.20,97.45 154.95,106.79 C158.30,118.12 160.19,134.79 159.82,149.88 L 159.50 163.25 L 164.88 164.64 C179.32,168.36 194.07,179.99 199.91,192.28 C205.52,204.09 209.99,226.01 210.00,241.78 L 210.00 248.06 L 215.31 244.05 C220.58,240.07 224.69,238.58 225.07,240.50 C225.18,241.05 223.59,242.39 221.52,243.49 C216.56,246.12 208.33,255.21 207.50,258.99 Z"
          stroke="#2d2d2d"
          fill="none"
          strokeWidth="4"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: isVisible ? 0 : pathLength,
            transition: 'stroke-dashoffset 1.5s ease-in-out',
          }}
        />
      </g>
    </svg>
  )
}

export default AnimatedArrow