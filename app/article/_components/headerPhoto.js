import { useState, useEffect } from 'react'

function useHeaderPhoto(totalImages, delay = 3000) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages)
    }, delay)

    return () => clearInterval(interval)
  }, [totalImages, delay])

  return currentIndex
}

export default useHeaderPhoto
