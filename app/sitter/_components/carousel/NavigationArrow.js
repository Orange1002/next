import styles from './_styles/NavigationArrow.module.css'
import Image from 'next/image'

const NavigationArrow = ({ direction, onClick, imageUrl, altText }) => {
  return (
    // 1.用button包
    <img
      src={imageUrl}
      alt={altText}
      onClick={onClick}
      className={styles.navigationArrow}
    />
  )
}

export default NavigationArrow
