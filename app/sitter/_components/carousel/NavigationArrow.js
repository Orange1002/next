import styles from './_styles/NavigationArrow.module.css'
import Image from 'next/image'

const NavigationArrow = ({ direction, onClick }) => {
  const arrowUrl =
    direction === 'next'
      ? 'https://cdn.builder.io/api/v1/image/assets/TEMP/0f7c5d75b9d1d6a4f80532636f9e03cf55919981'
      : 'https://cdn.builder.io/api/v1/image/assets/TEMP/1ab15d67bb1597af12e945e6afed94dc6fce9375'

  const positionClass = direction === 'next' ? 'end-0' : 'start-0'

  return (
    <button
      onClick={onClick}
      className={`bg-transparent border-0 btn btn-outline-dark position-absolute top-50 translate-middle-y z-3 ${positionClass}`}
      style={{ width: 40, height: 40 }}
    >
      <Image
        src={arrowUrl}
        alt={direction}
        width={32}
        height={32}
        style={{ height: 'auto' }}
      />
    </button>
  )
}

export default NavigationArrow
