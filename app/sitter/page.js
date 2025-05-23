'use client'

import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

// 其他元件 import
import PetCareServices from './_components/hero-section/PetCareServices'
import ComponentsSectionIntro from './_components/section-intro'
import InputDesign from './_components/carousel/InputDesign'
import ComponentsCustomerFeedback from './_components/customer-feedback'
import CommonQuestions from './_components/CommonQuestions/CommonQuestions'

export default function SitterPage() {
  const router = useRouter()

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
      <div className="container text-end py-4">
        <button
          className="btn btn-outline-primary"
          onClick={handleSwitchToSitter}
        >
          🔁 切換為保母模式
        </button>
      </div>

      <PetCareServices />
      <ComponentsSectionIntro />
      <InputDesign />
      <ComponentsCustomerFeedback />
      <CommonQuestions />
    </>
  )
}
