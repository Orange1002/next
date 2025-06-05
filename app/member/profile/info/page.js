'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './member-Info.module.scss'
import Image from 'next/image'
import SectionTitle from '../../_components/SectionTitle/layout'
import BtnCustom from '../../_components/BtnCustom/layout'
import MobileMemberMenu from '../../_components/mobileLinks/layout'
import { AddressArray } from './edit/[id]/_components/AddressArray/AddressArray'

export default function MemberViewPage() {
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const baseUrl = 'http://localhost:3005'

  function Field({ label, value, icon, name, iconComponent, autoComplete }) {
    return (
      <div className={`${styles.inputField} d-flex align-items-center mb-3`}>
        {icon && <i className={`${styles.icon} ${icon} fs-3 ms-3`}></i>}
        {iconComponent && <span className="me-2">{iconComponent}</span>}
        <input
          type="text"
          className="form-control ps-3"
          placeholder={label}
          value={value || ''}
          name={name}
          autoComplete={autoComplete}
          readOnly
          disabled
        />
      </div>
    )
  }

  // 根據 city 與 zip 找出鄉鎮名稱
  function getTownName(city, zip) {
    const cityObj = AddressArray.find((c) => c.city === city)
    if (!cityObj) return ''
    const townObj = cityObj.town.find((t) => t.zip === zip)
    return townObj ? townObj.name : ''
  }

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
      <div className={`${styles.block} mt-3 p-4 h-100`}>
        <div className="d-flex flex-column justify-content-evenly h-100 w-100">
          {/* 頭貼區 */}
          <div className="d-flex justify-content-center mb-4">
            <div
              className={`rounded-circle border overflow-hidden ${styles.memberImg}`}
            >
              <Image
                src={imageSrc}
                alt="使用者頭貼"
                className="object-fit-cover"
                width={100}
                height={100}
                priority
              />
            </div>
          </div>

          <div className="row g-2 justify-content-center">
            {/* 左欄 */}
            <div className="col-12 col-lg-6 d-flex flex-column align-items-center">
              <Field
                label="使用者名稱"
                value={member.username}
                icon="bi bi-person"
                name="username"
                autoComplete="username"
              />
              <Field
                label="真實姓名"
                value={member.realname || '未填寫真實姓名'}
                icon="bi-person-lines-fill"
                name="realname"
                autoComplete="realname"
              />
              <Field
                label="性別"
                value={
                  member.gender === 'male'
                    ? '男'
                    : member.gender === 'female'
                      ? '女'
                      : '未填寫性別'
                }
                icon="bi bi-gender-ambiguous"
                name="gender"
              />
              <Field
                label="電子信箱"
                value={member.email}
                icon="bi bi-envelope"
                name="email"
                autoComplete="email"
              />
            </div>

            {/* 右欄 */}
            <div className="col-12 col-lg-6 d-flex flex-column align-items-center">
              <Field
                label="手機號碼"
                value={member.phone || '未填寫手機號碼'}
                icon="bi bi-phone"
                name="phone"
                autoComplete="phone"
              />
              <Field
                label="生日"
                value={member.birth_date || '未填寫生日'}
                icon="bi bi-cake"
                name="birth_date"
                autoComplete="birthday"
              />
              <div className="d-flex flex-column w-100 px-lg-3">
                <div className="d-flex flex-lg-row flex-column justify-content-between">
                  <label
                    className={`${styles.label} w-100 mb-3 me-lg-2 ms-lg-1`}
                  >
                    縣市
                    <select
                      value={member.city}
                      disabled
                      className="form-select"
                    >
                      <option value="">{member.city || '未填寫縣市'}</option>
                    </select>
                  </label>

                  <label
                    className={`${styles.label} w-100 mb-3 me-lg-1 ms-lg-2`}
                  >
                    鄉鎮
                    <br />
                    市區
                    <select value={member.zip} disabled className="form-select">
                      <option value="">
                        {getTownName(member.city, member.zip) ||
                          '未填寫鄉鎮市區'}
                      </option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="w-100 h-100 px-lg-3">
                <label className={`${styles.address} w-100 mt-2`}>
                  地址
                  <input
                    type="text"
                    value={member.address || '未填寫預設住址'}
                    readOnly
                    disabled
                    className="form-control"
                    placeholder="未填寫預設住址"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 編輯按鈕 */}
          <div className="d-flex justify-content-center">
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
      <MobileMemberMenu />
    </>
  )
}
