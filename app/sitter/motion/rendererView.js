'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { initScene } from './SceneInit'

export default function RendererView() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)

  // 與原頁面一致的控制參數
  const mouse = useRef([0.5, 0.5])
  const zoompos = useRef(-100)
  const zoomspeed = useRef(0.015)
  const minzoomspeed = useRef(0.015)

  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const camera = new THREE.PerspectiveCamera(50, width / height, 1e-6, 1e27)
    cameraRef.current = camera

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const onMouseMove = (e) => {
      mouse.current[0] = e.clientX / window.innerWidth
      mouse.current[1] = e.clientY / window.innerHeight
    }

    const onMouseWheel = (e) => {
      const dir = Math.sign(e.deltaY)
      zoomspeed.current = dir / 10
      minzoomspeed.current = 0.001
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('wheel', onMouseWheel)

    initScene((scene) => {
      sceneRef.current = scene

      const animate = () => {
        if (!scene || !camera) return

        // zoom 計算邏輯與原版一致
        const minzoom = 0.000001
        const maxzoom = 1e22

        const zoom = THREE.MathUtils.clamp(
          Math.exp(zoompos.current),
          minzoom,
          maxzoom
        )
        zoompos.current = Math.log(zoom)
        zoompos.current += zoomspeed.current
        let damping =
          Math.abs(zoomspeed.current) > minzoomspeed.current ? 0.95 : 1.0
        if (
          (zoom === minzoom && zoomspeed.current < 0) ||
          (zoom === maxzoom && zoomspeed.current > 0)
        ) {
          damping = 0.85
        }
        zoomspeed.current *= damping

        const [mx, my] = mouse.current
        camera.position.x = Math.sin(0.5 * Math.PI * (mx - 0.5)) * zoom
        camera.position.y = Math.sin(0.25 * Math.PI * (my - 0.5)) * zoom
        camera.position.z = Math.cos(0.5 * Math.PI * (mx - 0.5)) * zoom
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)
        animationIdRef.current = requestAnimationFrame(animate)
      }

      animate()
    })

    return () => {
      cancelAnimationFrame(animationIdRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('wheel', onMouseWheel)
      renderer.dispose()
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      id="container_logzbuf"
      style={{ width: '100%', height: '100vh', position: 'relative' }}
    >
      <h2 className="renderer_label">對數 Z 緩衝區</h2>
      <div ref={mountRef}></div>
    </div>
  )
}
