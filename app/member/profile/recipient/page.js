'use client'

import React from 'react'
import RecipientCard from './_components/RecipientCard/layout'
import BtnCustom from '../../_components/BtnCustom/layout'
import { useRouter } from 'next/navigation'
import SectionTitle from '../../_components/SectionTitle/layout'

export default function RecipientPage() {
  const router = useRouter()

  const recipients = [
    {
      id: '1',
      name: '王小明',
      phone: '0900-111-222',
      address: '台北市信義區',
    },
    {
      id: '2',
      name: '李小華',
      phone: '0911-333-444',
      address: '新北市板橋區',
    },
  ]

  const handleAddRecipient = () => {
    router.push('/member/profile/recipient/add')
  }

  return (
    <>
      <SectionTitle>常用收件人</SectionTitle>
      <div className="row justify-content-center g-0 mt-3 ">
        {recipients.map((recipient) => (
          <div key={recipient.id} className="col-12">
            <RecipientCard recipient={recipient} />
          </div>
        ))}

        <div className="col-12 d-flex justify-content-center mt-4">
          <BtnCustom onClick={handleAddRecipient}>新增常用收件人</BtnCustom>
        </div>
      </div>
    </>
  )
}
