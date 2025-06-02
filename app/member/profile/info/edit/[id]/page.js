'use client'
import { useEffect, useState } from 'react'
import styles from './member-Info.module.scss'
import BtnCustom from '../../../../_components/BtnCustom/layout'
import Image from 'next/image'
import SectionTitle from '../../../../_components/SectionTitle/layout'
import CancelButton from '../../../../_components/BtnCustomGray/layout'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../../../hooks/use-auth'

export default function InfoPage() {
  const { setMember, refreshMember } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    email: '',
    phone: '',
    birthday: '',
  })

  const [preview, setPreview] = useState('/member/member_images/user-img.svg')
  const [avatarFile, setAvatarFile] = useState(null)
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false) // ✅ 新增

  // 載入會員資料
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/member/profile', {
          credentials: 'include',
        })

        if (!res.ok) throw new Error('Failed to fetch profile data')

        const data = await res.json()

        setFormData({
          username: data.username || '',
          gender: data.gender || '',
          email: data.email || '',
          phone: data.phone || '',
          birthday: data.birth_date ? data.birth_date.split('T')[0] : '',
        })

        const baseUrl = 'http://localhost:3005'
        const defaultImg = '/member/member_images/user-img.svg'
        const imageUrl = data.image_url
          ? data.image_url.startsWith('http')
            ? data.image_url
            : baseUrl + data.image_url
          : baseUrl + defaultImg

        setPreview(imageUrl)
        setHasCustomAvatar(!!data.image_url) // ✅ 若有圖片就設為 true
      } catch (error) {
        console.error('取得會員資料失敗', error)
      }
    }

    fetchMemberData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setPreview(URL.createObjectURL(file))
      setHasCustomAvatar(true) // ✅ 標記為自訂頭貼
    }
  }

  const handleRemovePhoto = () => {
    setAvatarFile(null)
    setPreview('http://localhost:3005/member/member_images/user-img.svg')
    setHasCustomAvatar(false) // ✅ 清除自訂標記
  }

  const handleGenderChange = (gender) => {
    setFormData((prev) => ({ ...prev, gender }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formPayload = new FormData()
      formPayload.append('username', formData.username)
      formPayload.append('email', formData.email)
      formPayload.append('birth_date', formData.birthday || '')
      formPayload.append('gender', formData.gender)
      formPayload.append('phone', formData.phone)

      if (hasCustomAvatar && avatarFile) {
        formPayload.append('avatar', avatarFile)
      }

      if (!avatarFile && !hasCustomAvatar) {
        formPayload.append('remove_avatar', 'true')
      }

      const res = await fetch('http://localhost:3005/api/member/profile/edit', {
        method: 'PUT',
        credentials: 'include',
        body: formPayload,
      })

      if (!res.ok) throw new Error('更新會員資料失敗')

      const result = await res.json()

      if (result.image_url) {
        const baseUrl = 'http://localhost:3005'
        const fullUrl = result.image_url.startsWith('http')
          ? result.image_url
          : baseUrl + result.image_url

        const withTimestamp = fullUrl + '?t=' + Date.now()
        setPreview(withTimestamp)

        setMember((prev) => ({
          ...prev,
          image_url: withTimestamp,
        }))
      }

      await refreshMember()
      router.replace('/member/profile/info')
    } catch (error) {
      console.error('更新錯誤:', error)
      alert('更新會員資料時發生錯誤')
    }
  }

  return (
    <>
      <SectionTitle>會員基本資料</SectionTitle>
      <div className={`${styles.block} mt-lg-3 px-4 py-3 h-100`}>
        <form className="member-profile-form h-100" onSubmit={handleSubmit}>
          <div className="row g-0 h-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-evenly col-12 col-lg-6 order-1 order-lg-0 h-100 w-100">
              {/* 頭貼區 */}
              <div className="d-flex justify-content-center align-items-center flex-column col-12 col-lg-6 mb-3 mb-lg-0">
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className={`rounded-circle border-3 overflow-hidden d-flex justify-content-center align-items-center ${styles.memberImg}`}
                  >
                    <Image
                      src={preview}
                      alt="使用者頭貼"
                      className="object-fit-cover h-100 w-100"
                      width={100}
                      height={100}
                    />
                  </div>

                  <div className="mt-3 d-flex gap-2">
                    <button
                      type="button"
                      className={`fs-6 ${styles.btnImg1}`}
                      onClick={() =>
                        document.getElementById('upload-img')?.click()
                      }
                    >
                      上傳照片
                    </button>
                    <button
                      type="button"
                      className={`fs-6 ${styles.btnImg2}`}
                      onClick={handleRemovePhoto}
                    >
                      移除照片
                    </button>
                  </div>

                  <input
                    type="file"
                    id="upload-img"
                    name="avatar"
                    accept="image/*"
                    className="d-none"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* 資料欄位 */}
              <div className={`${styles.inputField} mb-2`}>
                <i className={`${styles.icon} bi bi-person fs-3`}></i>
                <input
                  type="text"
                  placeholder="使用者名稱"
                  value={formData.username}
                  onChange={handleChange}
                  name="username"
                />
              </div>

              <div className="d-flex flex-column justify-content-center w-100">
                <div className="d-flex justify-content-center gap-3">
                  <button
                    type="button"
                    className={`${styles.btnRadio} btn ${formData.gender === 'male' ? styles.active : ''}`}
                    onClick={() => handleGenderChange('male')}
                    tabIndex={0}
                  >
                    男生
                  </button>
                  <button
                    type="button"
                    className={`${styles.btnRadio} btn ${formData.gender === 'female' ? styles.active : ''}`}
                    onClick={() => handleGenderChange('female')}
                    tabIndex={0}
                  >
                    女生
                  </button>
                </div>
              </div>

              <div className={`${styles.inputFieldN} mb-2`}>
                <i className={`${styles.icon} bi bi-envelope fs-3`}></i>
                <input
                  type="email"
                  placeholder="電子信箱"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  readOnly
                  disabled
                />
              </div>

              <div className={`${styles.inputField} mb-2`}>
                <i className={`${styles.icon} bi bi-phone fs-3`}></i>
                <input
                  type="tel"
                  placeholder="手機號碼"
                  value={formData.phone}
                  onChange={handleChange}
                  name="phone"
                />
              </div>

              <div className={`${styles.inputField} mb-2`}>
                <i className={`${styles.icon} bi bi-cake fs-3`}></i>
                <input
                  type="date"
                  placeholder="生日"
                  value={formData.birthday}
                  onChange={handleChange}
                  name="birthday"
                />
              </div>

              <div className="d-flex gap-lg-5 justify-content-between justify-content-lg-center w-100">
                <CancelButton back={true}>取消</CancelButton>
                <BtnCustom>儲存資料</BtnCustom>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
