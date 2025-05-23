import Link from 'next/link'
import styles from './layout.module.css'

export default function Breadcrumb({ items = [] }) {
  return (
    <div className={`container ${styles.breadcrumb}`}>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb m-0">
          {items.map((item, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}
              aria-current={index === items.length - 1 ? 'page' : undefined}
            >
              {index === items.length - 1 || !item.href ? (
                item.label
              ) : (
                <Link href={item.href} className="text-decoration-none">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
