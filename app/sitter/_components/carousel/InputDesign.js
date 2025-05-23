'use client'
import Link from 'next/link'
import styles from './_styles/InputDesign.module.css'
import CaregiverCard from './CaregiverCard'
import NavigationArrow from './NavigationArrow'

const InputDesign = () => {
  const caregivers = [
    {
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/51eb0cbd4d012ba41fc21b3b00315226bbb683e4',
      name: '居服員姓名',
      description: '介紹與星星評分 下面做預約按鈕',
      isLiked: true,
    },
    {
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/00f79c73b6e6d6aaa90bca52c66007985318f47a',
      name: '居服員名字',
      description: '自我介紹',
      isLiked: false,
    },
    {
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/54d153d6b4c35c628a9b54d06436cb8daf1ad955',
      name: '居服員名字',
      description: '自我介紹',
      isLiked: false,
    },
    {
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/a416a81432517ee6d7d63c9167894e0bf0467c9d',
      name: '居服員姓名',
      description: '自我介紹',
      isLiked: false,
    },
  ]

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center gap-3">
          <div className="flex-grow-1 border-top border-3 border-dark title-line" />
          <h2 className="text-secondary section-title">寵物保母</h2>
          <div className="rounded-circle bg-dark dot-circle" />
        </div>
      </div>
      <section className={styles.container}>
        <NavigationArrow
          direction="prev"
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/1ab15d67bb1597af12e945e6afed94dc6fce9375"
          altText="Back"
        />
        <div className={styles.cardContainer}>
          {caregivers.map((caregiver, index) => (
            <CaregiverCard
              key={index}
              imageUrl={caregiver.imageUrl}
              name={caregiver.name}
              description={caregiver.description}
              isLiked={caregiver.isLiked}
            />
          ))}
        </div>
        <NavigationArrow
          direction="next"
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/0f7c5d75b9d1d6a4f80532636f9e03cf55919981"
          altText="Next"
        />
      </section>
      <div className="text-center mt-5">
        <Link
          href={`/sitter/sitter-list`}
          className="btn btn-lg btn-warning text-white fw-bold px-5 py-3"
          style={{ letterSpacing: 5 }}
        >
          查看更多
        </Link>
      </div>
    </div>
  )
}

export default InputDesign
