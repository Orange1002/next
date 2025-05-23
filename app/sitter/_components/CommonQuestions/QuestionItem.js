'use client'
import * as React from 'react'
import styles from './CommonQuestions.module.css'
import Image from 'next/image'

const QuestionItem = ({ question, imageUrl }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div
      className={styles.questionItem}
      role="button"
      aria-expanded={isOpen}
      onClick={() => setIsOpen(!isOpen)}
    >
      <h3 className={styles.questionText}>{question}</h3>
      <button
        className={styles.toggleButton}
        aria-label={isOpen ? 'Close question' : 'Open question'}
      >
        <img src={imageUrl} alt="" className={styles.toggleIcon} />
      </button>
    </div>
  )
}

export default QuestionItem
