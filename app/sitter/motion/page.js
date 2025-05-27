'use client'
import React from 'react'
import { motion } from 'framer-motion'
import './CorgiRunner.css'

export default function CorgiRunner() {
  return (
    <div className="scene">
      <div className="grass"></div>
      <motion.img
        src="corgi-run.gif"
        alt="Running corgi"
        className="corgi"
        animate={{
          x: ['-100px', '100%'],
          y: [0, -20, 0, -20, 0], // simulate jumping motion
        }}
        transition={{
          x: {
            repeat: Infinity,
            duration: 6,
            ease: 'linear',
          },
          y: {
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          },
        }}
      />
    </div>
  )
}
