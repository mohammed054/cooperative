import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'

const PARTICLE_COUNT = 360

const HeroAmbientCanvas = () => {
  const canvasRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion || !canvasRef.current) {
      return undefined
    }

    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0.1, 6)

    const pointsGroup = new THREE.Group()
    scene.add(pointsGroup)

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const stride = index * 3
      const radius = 1.1 + Math.random() * 2.8
      const angle = Math.random() * Math.PI * 2
      const spread = (Math.random() - 0.5) * 1.7

      positions[stride] = Math.cos(angle) * radius
      positions[stride + 1] = spread
      positions[stride + 2] = Math.sin(angle) * radius * 0.8
      sizes[index] = 0.015 + Math.random() * 0.04
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xf3e6d2,
      size: 0.036,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, pointsMaterial)
    pointsGroup.add(points)

    const ambient = new THREE.AmbientLight(0x64748b, 0.52)
    scene.add(ambient)

    const keyLight = new THREE.PointLight(0xf6d3a4, 1.1, 18)
    keyLight.position.set(2.8, 2.2, 5.6)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0x7b9fd0, 0.6, 16)
    fillLight.position.set(-2.4, -1.8, 4.8)
    scene.add(fillLight)

    const resize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (!width || !height) return

      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const clock = new THREE.Clock()
    let animationFrameId = 0

    const render = () => {
      const elapsed = clock.getElapsedTime()

      pointsGroup.rotation.y = elapsed * 0.05
      pointsGroup.rotation.x = Math.sin(elapsed * 0.28) * 0.07
      points.position.y = Math.sin(elapsed * 0.6) * 0.08

      renderer.render(scene, camera)
      animationFrameId = window.requestAnimationFrame(render)
    }

    resize()
    render()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animationFrameId)
      geometry.dispose()
      pointsMaterial.dispose()
      renderer.dispose()
    }
  }, [shouldReduceMotion])

  return (
    <canvas
      ref={canvasRef}
      className="flagship-ambient-canvas"
      aria-hidden="true"
    />
  )
}

export default HeroAmbientCanvas
