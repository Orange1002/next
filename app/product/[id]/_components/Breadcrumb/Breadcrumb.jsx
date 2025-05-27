import Link from 'next/link'
import styles from './Breadcrumb.module.scss'
import { categorySlugMap, subcategorySlugMap } from './_categoryMap'

export default function Breadcrumb({
  categoryName,
  subcategoryName,
  categoryId,
  subcategoryId,
}) {
  // 找出 slug
  const categorySlug = Object.entries(categorySlugMap).find(
    ([, value]) => value.id === categoryId
  )?.[0]

  const subcategorySlug = Object.entries(subcategorySlugMap).find(
    ([, value]) => value.id === subcategoryId
  )?.[0]

  return (
    <nav className={styles.breadcrumbNav} aria-label="breadcrumb">
      <ol>
        <li>
          <Link href="/">HOME</Link>
        </li>
        <li>
          <ChevronIcon />
        </li>
        <li>
          <Link href="/product">Products</Link>
        </li>

        {categoryName && categorySlug && (
          <>
            <li>
              <ChevronIcon />
            </li>
            <li>
              <Link href={`/product/category/${categorySlug}`}>
                {categorySlugMap[categorySlug]?.name || categoryName}
              </Link>
            </li>
          </>
        )}

        {subcategoryName && subcategorySlug && (
          <>
            <li>
              <ChevronIcon />
            </li>
            <li>
              <Link href={`/product/subcategory/${subcategorySlug}`}>
                {subcategoryName}
              </Link>
            </li>
          </>
        )}
      </ol>
    </nav>
  )
}

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.10576 13.4569C5.06211 13.4133 5.02748 13.3616 5.00385 13.3047C4.98022 13.2477 4.96805 13.1867 4.96805 13.125C4.96805 13.0634 4.98022 13.0023 5.00385 12.9454C5.02748 12.8884 5.06211 12.8367 5.10576 12.7931L10.3998 7.50002L5.10576 2.20689C5.01775 2.11887 4.9683 1.9995 4.9683 1.87502C4.9683 1.75054 5.01775 1.63116 5.10576 1.54314C5.19378 1.45512 5.31316 1.40568 5.43764 1.40568C5.56212 1.40568 5.6815 1.45512 5.76952 1.54314L11.3945 7.16814C11.4382 7.21169 11.4728 7.26341 11.4964 7.32036C11.5201 7.37731 11.5322 7.43836 11.5322 7.50002C11.5322 7.56167 11.5201 7.62273 11.4964 7.67967C11.4728 7.73662 11.4382 7.78835 11.3945 7.83189L5.76951 13.4569Z"
        fill="#505050"
      />
    </svg>
  )
}
