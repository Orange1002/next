'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const AnimatedDog = () => {
  const [isScary, setIsScary] = useState(false)

  const handleClick = () => {
    setIsScary(true)
    setTimeout(() => setIsScary(false), 2000)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className="cursor-pointer mt-4"
    >
      {isScary ? (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="images/scary-dog.webp"
            alt="Scary Dog"
            width={320}
            height={320}
            className="rounded shadow-lg"
            priority
          />
        </motion.div>
      ) : (
        <Image
          src="/images/calm-dog.png"
          alt="Calm Dog"
          width={320}
          height={320}
          className="rounded shadow-md border-rounded"
          priority
        />
      )}
    </div>
  )
}

export default AnimatedDog
