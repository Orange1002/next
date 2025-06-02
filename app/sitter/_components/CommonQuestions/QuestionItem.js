'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import styles from './CommonQuestions.module.css'

const QuestionItem = ({ question, answer, imageUrl }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = (e) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen((prev) => !prev)
    }
  }

  return (
    <div
      className={styles.questionItem}
      role="button"
      aria-expanded={isOpen}
      tabIndex={0}
      onClick={() => setIsOpen((prev) => !prev)}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.questionHeader}>
        <h3 className={styles.questionText}>{question}</h3>
        <button
          className={styles.toggleButton}
          aria-label={isOpen ? 'Close question' : 'Open question'}
          type="button"
          onClick={toggleOpen}
        >
          <Image
            src={imageUrl}
            alt=""
            className={styles.toggleIcon}
            width={11}
            height={11}
            aria-hidden="true"
            priority={false}
          />
        </button>
      </div>

      <div
        className={`${styles.answer} ${isOpen ? styles.answerOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default QuestionItem
