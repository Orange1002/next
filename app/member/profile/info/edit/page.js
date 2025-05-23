'use client'
import { useEffect, useState } from 'react'
import styles from './member-Info.module.scss'
import BtnCustom from '../../../_components/BtnCustom/layout'
import Image from 'next/image'
import SectionTitle from '../../../_components/SectionTitle/layout'
import CancelButton from '../../../_components/BtnCustomGray/layout'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../../hooks/use-auth' // 確認有提供 setMember

export default function InfoPage() {
  const { setMember } = useAuth()
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
        setPreview(
          data.image_url
            ? data.image_url.startsWith('http')
              ? data.image_url
              : baseUrl + data.image_url
            : '/member/member_images/user-img.svg'
        )
      } catch (error) {
        console.error('取得會員資料失敗', error)
      }
    }

    fetchMemberData()
  }, [])

  // 表單欄位變動
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 上傳檔案改變
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setPreview(URL.createObjectURL(file)) // 立即預覽
    }
  }

  // 移除照片
  const handleRemovePhoto = () => {
    setAvatarFile(null)
    setPreview('/member/member_images/user-img.svg')
  }

  // 性別切換
  const handleGenderChange = (gender) => {
    setFormData((prev) => ({ ...prev, gender }))
  }

  // 表單提交
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formPayload = new FormData()
      formPayload.append('username', formData.username)
      formPayload.append('email', formData.email)
      formPayload.append('birth_date', formData.birthday || '')
      formPayload.append('gender', formData.gender)
      formPayload.append('phone', formData.phone)

      if (avatarFile) {
        formPayload.append('avatar', avatarFile)
      }

      const res = await fetch('http://localhost:3005/api/member/profile/edit', {
        method: 'PUT',
        credentials: 'include',
        body: formPayload,
      })

      if (!res.ok) {
        throw new Error('更新會員資料失敗')
      }

      const result = await res.json()

      // 更新預覽圖片與 Context 中 member.image_url
      if (result.image_url) {
        const baseUrl = 'http://localhost:3005'
        const fullUrl = result.image_url.startsWith('http')
          ? result.image_url
          : baseUrl + result.image_url

        // 新圖片更新時加時間戳
        setPreview(fullUrl + '?t=' + Date.now())

        setMember((prev) => ({
          ...prev,
          image_url: fullUrl + '?t=' + Date.now(),
        }))
      }

      router.push('/member/profile/info')
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
                      上傳頭貼
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

              {/* 其他表單欄位 */}
              <div className="mb-3 w-100">
                <label htmlFor="username" className="form-label">
                  使用者名稱
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="請輸入您的名稱"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3 d-flex flex-column justify-content-center w-100">
                <label className="form-label d-block">性別</label>
                <div className="d-flex justify-content-center gap-3">
                  <div className="w-50">
                    <button
                      type="button"
                      className={`${styles.btnRadio} btn w-100 ${formData.gender === 'male' ? styles.active : ''}`}
                      onClick={() => handleGenderChange('male')}
                      tabIndex={0}
                    >
                      男生
                    </button>
                  </div>
                  <div className="w-50">
                    <button
                      type="button"
                      className={`${styles.btnRadio} btn w-100 ${formData.gender === 'female' ? styles.active : ''}`}
                      onClick={() => handleGenderChange('female')}
                      tabIndex={0}
                    >
                      女生
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-3 w-100">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3 w-100">
                <label htmlFor="phone" className="form-label">
                  手機號碼
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder="09xxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="w-100 mb-lg-3">
                <label htmlFor="birthday" className="form-label">
                  生日
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
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
