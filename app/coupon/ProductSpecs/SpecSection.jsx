import styles from './ProductSpecs.module.scss'

export default function SpecSection({ title, items }) {
  return (
    <>
      <div>{title}</div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <div>---------------------</div>
    </>
  )
}
