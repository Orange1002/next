'use client'

import React, { useEffect, useState } from 'react'
import RecipientCard from './_components/RecipientCard/layout'
import BtnCustom from '../../_components/BtnCustom/layout'
import { useRouter } from 'next/navigation'
import SectionTitle from '../../_components/SectionTitle/layout'
import { useAuth } from '../../../../hooks/use-auth.js'
import styles from './member-recipient.module.scss'
import MobileMemberMenu from '../../_components/mobileLinks/layout'

export default function RecipientPage() {
  const router = useRouter()
  const { isAuth, member, loading } = useAuth()
  const [recipients, setRecipients] = useState([])
  const [loadingRecipients, setLoadingRecipients] = useState(true)

  // ✅ 抽出資料取得邏輯
  const fetchRecipients = async () => {
    try {
      const res = await fetch(
        'http://localhost:3005/api/member/recipients/all',
        {
          credentials: 'include',
        }
      )
      if (!res.ok) throw new Error('取得收件人失敗')
      const data = await res.json()
      if (data.success) {
        setRecipients(data.data)
      } else {
        console.error(data.message)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingRecipients(false)
    }
  }

  // ✅ 登入後載入收件人
  useEffect(() => {
    if (!loading && !isAuth) {
      alert('請先登入')
      router.push('/member/login?type=signin')
      return
    }

    if (isAuth) {
      fetchRecipients()
    }
  }, [loading, isAuth, member, router])

  // ✅ 限制最多 5 筆
  const handleAddRecipient = () => {
    if (recipients.length >= 5) {
      alert('最多只能新增5位常用收件人')
      return
    }

    router.push('/member/profile/recipient/add')
  }

  if (loading || loadingRecipients) {
    return <div className="p-4">載入中...</div>
  }

  return (
    <>
      <SectionTitle>常用收件人</SectionTitle>
      <div className="row justify-content-center g-0 mt-3 h-100">
        <div
          className={`${styles.block} d-flex flex-column justify-content-start g-0 ps-lg-3 pe-lg-3 pt-lg-3 pb-lg-3 p-3 h-100`}
        >
          {recipients.length === 0 ? (
            <p className="text-center">尚無常用收件人</p>
          ) : (
            recipients.map((recipient) => (
              <div key={recipient.id} className="col-12">
                <RecipientCard
                  recipient={recipient}
                  onDeleteSuccess={fetchRecipients} // ✅ 傳遞刷新函式
                />
              </div>
            ))
          )}
          <div className="col-12 d-flex justify-content-center mt-4">
            <BtnCustom onClick={handleAddRecipient}>新增常用收件人</BtnCustom>
          </div>
        </div>
      </div>
      <MobileMemberMenu />
    </>
  )
}
