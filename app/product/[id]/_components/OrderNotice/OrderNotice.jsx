import styles from './OrderNotice.module.scss'

export default function OrderNotice({ title = '訂購須知', content = [] }) {
  return (
    <div className={styles.orderNotice}>
      <div className={styles.descTitle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
        >
          <path
            d="M0 1.625C0 1.19402 0.171205 0.780698 0.475951 0.475951C0.780698 0.171205 1.19402 0 1.625 0L11.375 0C11.806 0 12.2193 0.171205 12.524 0.475951C12.8288 0.780698 13 1.19402 13 1.625V11.375C13 11.806 12.8288 12.2193 12.524 12.524C12.2193 12.8288 11.806 13 11.375 13H1.625C1.19402 13 0.780698 12.8288 0.475951 12.524C0.171205 12.2193 0 11.806 0 11.375V1.625Z"
            fill="#505050"
          />
        </svg>
        <span>{title}</span>
      </div>

      <div className={styles.notice}>
        <p>
          {content.map((paragraph, i) =>
            paragraph.split('\n').map((line, j, arr) => (
              <span key={`${i}-${j}`}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))
          )}
        </p>
      </div>
    </div>
  )
}
