'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DogForm from '../../_components/DogForm/layout'
import SectionTitle from '../../../../_components/SectionTitle/layout'
import Swal from 'sweetalert2'

export default function DogsEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    const dogId = Array.isArray(id) ? id[0] : id
    if (!dogId) return

    async function fetchDogData() {
      try {
        const res = await fetch(
          `http://localhost:3005/api/member/dogs/${dogId}`,
          {
            credentials: 'include',
          }
        )
        if (!res.ok) throw new Error('取得狗狗資料失敗')
        const data = await res.json()
        console.log(data)

        // ✅ 確保含有 id
        setInitialData({
          id: dogId,
          name: data.data.name || '',
          age: data.data.age || '',
          breed: data.data.breed || '',
          description: data.data.description || '',
          size_id: data.data.size_id || '',
          photos: Array.isArray(data.data.dogs_images)
            ? data.data.dogs_images.map(
                (imgPath) => `http://localhost:3005${imgPath}`
              )
            : [],
        })
      } catch (error) {
        console.error(error)
      }
    }

    fetchDogData()
  }, [id])

  // console.log('params:', useParams())
  // console.log(initialData)

  const handleSubmit = async (formData) => {
    const data = new FormData()
    data.append('name', formData.name)
    data.append('age', formData.age)
    data.append('breed', formData.breed)
    data.append('size_id', formData.size_id)
    data.append('description', formData.description)

    if (formData.newPhotos?.length) {
      formData.newPhotos.forEach((file) => data.append('dog_images', file))
    }

    data.append('existingPhotos', JSON.stringify(formData.existingPhotos || []))

    if (formData.photosToDelete?.length) {
      const photosToDeleteRelative = formData.photosToDelete.map((url) =>
        url.replace('http://localhost:3005', '')
      )
      data.append('photosToDelete', JSON.stringify(photosToDeleteRelative))
    } else {
      data.append('photosToDelete', JSON.stringify([]))
    }

    try {
      const res = await fetch(
        `http://localhost:3005/api/member/dogs/edit/${formData.id}`,
        {
          method: 'PUT',
          body: data,
          credentials: 'include',
        }
      )

      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: '更新成功',
          showConfirmButton: false,
          timer: 1000,
          background: '#e9f7ef',
          color: '#2e7d32',
        })
        router.push('/member/profile/dogs')
      } else {
        const err = await res.json()
        await Swal.fire({
          icon: 'error',
          title: '更新失敗',
          text: err.message || '請稍後再試',
          confirmButtonColor: '#d33',
          background: '#fdecea',
          color: '#b71c1c',
        })
      }
    } catch (error) {
      console.error(error)
      await Swal.fire({
        icon: 'error',
        title: '更新失敗',
        text: '請檢查網路或稍後再試',
        confirmButtonColor: '#d33',
        background: '#fdecea',
        color: '#b71c1c',
      })
    }
  }

  if (!initialData) return <div>載入中...</div>

  return (
    <>
      <SectionTitle>編輯狗狗資料</SectionTitle>
      <div className="mt-3 h-100">
        <DogForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      </div>
    </>
  )
}
