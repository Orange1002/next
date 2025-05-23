import styles from './_styles/CaregiverCard.module.css'
import HeartIcon from './HeartIcon'

const CaregiverCard = ({ imageUrl, name, description, isLiked }) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={name} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.description}>{description}</p>
        <div className={styles.iconContainer}>
          <HeartIcon filled={isLiked} />
        </div>
      </div>
    </article>
  )
}

export default CaregiverCard
