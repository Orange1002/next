'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './member-Info.module.scss'
import Image from 'next/image'
import SectionTitle from '../../_components/SectionTitle/layout'
import BtnCustom from '../../_components/BtnCustom/layout'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import { LiaBirthdayCakeSolid } from 'react-icons/lia'

export default function MemberViewPage() {
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const baseUrl = 'http://localhost:3005'

  useEffect(() => {
    fetch('http://localhost:3005/api/member/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401) {
          router.replace('/member/login?type=signin')
          return null
        }
        if (!res.ok) throw new Error('無法取得會員資料')
        return res.json()
      })
      .then((data) => {
        if (data) setMember(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <p>載入中...</p>
  if (error) return <p>錯誤：{error}</p>
  if (!member) return null

  const timestamp = new Date().getTime()

  const imageSrc =
    member.image_url && member.image_url !== ''
      ? member.image_url.startsWith('http')
        ? `${member.image_url}?t=${timestamp}`
        : `${baseUrl}${member.image_url}?t=${timestamp}`
      : '/member/member_images/user-img.svg'

  return (
    <>
      <SectionTitle>會員基本資料</SectionTitle>
      <div className={`${styles.block} mt-lg-3 px-4 py-3 h-100`}>
        <div className="row g-0 h-100 w-100">
          <div className="d-flex flex-column text-center align-items-center justify-content-evenly col-12 col-lg-6 order-1 order-lg-0 h-100 w-100">
            {/* 頭貼區 */}
            <div className="d-flex justify-content-center align-items-center flex-column mb-3">
              <div
                className={`rounded-circle border overflow-hidden d-flex justify-content-center align-items-center ${styles.memberImg}`}
              >
                <Image
                  src={imageSrc}
                  alt="使用者頭貼"
                  className="object-fit-cover h-100 w-100"
                  width={100}
                  height={100}
                  priority
                />
              </div>
            </div>

            {/* 資料欄位 */}
            {/* 使用者名稱 */}
            <div className={`${styles.inputField} mb-2`}>
              <i className={`${styles.icon} bi bi-person fs-3`}></i>
              <input
                type="text"
                placeholder="請輸入使用者名稱"
                value={member.username || ''}
                readOnly
              />
            </div>

            {/* 性別 */}
            <div className={`${styles.inputField} mb-2`}>
              <i className={`${styles.icon} bi bi-gender-ambiguous fs-3`}></i>
              <input
                type="text"
                placeholder="性別"
                value={
                  member.gender ? (member.gender === 'male' ? '男' : '女') : ''
                }
                readOnly
              />
            </div>

            {/* Email */}
            <div className={`${styles.inputField} mb-2`}>
              <HiOutlineEnvelope className={`${styles.icon} ms-3 h-50 w-50`} />
              <input
                type="text"
                placeholder="電子信箱"
                value={member.email || ''}
                readOnly
              />
            </div>

            {/* 手機號碼 */}
            <div className={`${styles.inputField} mb-2`}>
              <i className={`${styles.icon} bi bi-phone fs-3`}></i>
              <input
                type="text"
                placeholder="請輸入手機號碼"
                value={member.phone || ''}
                readOnly
              />
            </div>

            {/* 生日 */}
            <div className={`${styles.inputField} mb-2`}>
              <LiaBirthdayCakeSolid
                className={`${styles.icon} ms-3 h-50 w-50`}
              />
              <input
                type="text"
                placeholder="生日"
                value={member.birth_date || ''}
                readOnly
              />
            </div>

            {/* 編輯按鈕 */}
            <div className="mt-4">
              <BtnCustom
                onClick={() => {
                  if (member?.id) {
                    router.push(`/member/profile/info/edit/${member.id}`)
                  } else {
                    alert('找不到會員 ID')
                  }
                }}
              >
                編輯資料
              </BtnCustom>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
