import SpecSection from './SpecSection'
import styles from './ProductSpecs.module.scss'

export default function ProductSpecs({ specs }) {
  return (
    <div className={styles.productSpecs}>
      {specs.map((section, index) => (
        <SpecSection key={index} title={section.title} items={section.items} />
      ))}
    </div>
  )
}