'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DogForm from '../_components/DogForm/layout'
import SectionTitle from '../../../_components/SectionTitle/layout'

export default function DogAddPage() {
  const router = useRouter()

  return (
    <>
      <SectionTitle>新增狗狗資料</SectionTitle>
      <div className="container py-4">
        <DogForm onSubmit={() => router.push('/member/profile/dogs')} />
      </div>
    </>
  )
}
