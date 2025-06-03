'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

import PetCareServices from './_components/hero-section/PetCareServices'
import ComponentsSectionIntro from './_components/section-intro'
import ComponentsCustomerFeedback from './_components/customer-feedback'
import CommonQuestions from './_components/CommonQuestions/CommonQuestions'
import ReviewsSection from './reviewsSection/page'
import MySitterCard from './_components/carousel-sitter/page'
import './_styles/style-sitter-list.scss'

export default function SitterPage() {
  const router = useRouter()
  const [hasSitter, setHasSitter] = useState(false)

  useEffect(() => {
    const fetchSitter = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/sitter/manage', {
          credentials: 'include',
        })
        const data = await res.json()
        if (res.ok && data.sitter && data.sitter.id) {
          setHasSitter(true)
        }
      } catch (err) {
        console.error('查詢保母失敗', err)
      }
    }

    fetchSitter()
  }, [])

  const handleSwitchToSitter = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/sitter/manage', {
        credentials: 'include',
      })
      const data = await res.json()

      if (res.ok) {
        if (data.sitter && data.sitter.id) {
          router.push(`/sitter/edit/${data.sitter.id}`)
        } else {
          await Swal.fire({
            icon: 'info',
            title: '尚未新增任何保母',
            text: '請先新增保母資料',
            confirmButtonText: '前往新增',
          })
          router.push('/sitter/create')
        }
      } else {
        Swal.fire('錯誤', data.message || '無法切換身分', 'error')
      }
    } catch (err) {
      console.error('切換保母模式錯誤', err)
      Swal.fire('錯誤', '伺服器錯誤，請稍後再試', 'error')
    }
  }

  return (
    <>
      <div className="container py-4">
        <div className="d-flex justify-content-end gap-2">
          {!hasSitter && (
            <button
              className="btn btn-outline-dark"
              onClick={() => router.push('/sitter/create')}
            >
              📝 申請成為保母
            </button>
          )}
          <button
            className="btn btn-outline-dark"
            onClick={handleSwitchToSitter}
          >
            🔁 切換為保母頁面
          </button>
        </div>

        <PetCareServices />
        <ComponentsSectionIntro />
        <ReviewsSection />
        <MySitterCard></MySitterCard>
        <ComponentsCustomerFeedback />
        <CommonQuestions />
      </div>
    </>
  )
}
