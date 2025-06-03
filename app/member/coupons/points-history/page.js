'use client'

import { useEffect, useState } from 'react'
import styles from './points-history.module.scss'
import Link from 'next/link'

export default function PointsHistoryPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/me/points', {
          credentials: 'include',
        })
        const data = await res.json()
        setRecords(data.history || [])
      } catch (err) {
        console.error('❌ 取得點數紀錄失敗', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPoints()
  }, [])

  return (
    <section className={styles.historySection}>
      <div className={styles.btnContainer}>
        <Link href={'/member/coupons'} className={styles.pointsHistory}>
          返回
        </Link>
      </div>

      <div className={`container ${styles.container}`}>
        <h2 className={styles.title}>點數使用紀錄</h2>
        {loading ? (
          <p>載入中...</p>
        ) : records.length === 0 ? (
          <p>目前沒有點數紀錄</p>
        ) : (
          <table className={styles.recordTable}>
            <thead>
              <tr>
                <th>日期</th>
                <th>取得來源</th>
                <th>點數</th>
                <th>到期日</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>{r.source || '其他'}</td>
                  <td>{r.amount}</td>
                  <td>
                    {r.expiresAt
                      ? new Date(r.expiresAt).toLocaleDateString()
                      : '無'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
