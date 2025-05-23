'use client'

import styles from './layout.module.css'

export default function SubmitButton({ onClick, className = '', children }) {
  return (
    <button
      type="submit"
      to="/"
      className={`d-block mt-3 mt-lg-0 ${styles.btnCustom}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
