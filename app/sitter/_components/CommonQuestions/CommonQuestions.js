'use client'
import * as React from 'react'
import styles from './CommonQuestions.module.css'
import QuestionItem from './QuestionItem'

const CommonQuestions = () => {
  const questions = [
    {
      question: '服務及收費方式？',
      answer:
        '我們提供多種寄宿服務方案，收費依照寵物大小及寄宿時間計算。詳細價格請參考官網價格表，或聯絡客服諮詢。',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/ba8a4729efbcc034ceca17f5bed9b1c12e1c9503?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3',
    },
    {
      question: '提供的寄宿服務包括？',
      answer:
        '我們的寄宿服務包含每日餵食、玩耍時間、定時遛狗、基礎清潔及健康觀察，確保您的毛孩舒適又安全。',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/dbe1848adcd14ec30ddc39a3b40bbfe00a414120?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3',
    },
    {
      question: '可以帶毛孩看醫生或送洗嗎？',
      answer:
        '可以的！我們提供代帶看醫生及美容洗澡的服務，需提前預約並另行收費，請與我們客服聯絡以安排細節。',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/e3573c47c389fe3923fcb77de165e2503410c202?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3',
    },
    {
      question: '想加入毛孩居服員行列？',
      answer:
        '歡迎加入！請先填寫報名表，我們會安排面試及培訓，確保您具備專業照護技能及愛心。',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/a6a01bd964a296efb0ac3860d6d859f540f38764?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3',
    },
    {
      question: '成為正式毛孩居服員需要參加哪些訓練課程？',
      answer:
        '您需要完成基礎寵物照護課程、緊急處理訓練以及服務流程介紹，通過考核後即可成為正式居服員。',
      imageUrl:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/f1563e27646835ec25218301d7763cf904ea0f16?placeholderIfAbsent=true&apiKey=c90e572de0d3401aa14be1598ad8e7f3',
    },
  ]

  return (
    <div className="container py-5 text-center">
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center gap-3">
          <div className="flex-grow-1 border-top border-3 border-dark title-line" />
          <h2 className="text-secondary section-title">FAQ</h2>
          <div className="rounded-circle bg-dark dot-circle" />
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <div>
            <h1 className={styles.mainTitle}>COMMON</h1>
            <h2 className={styles.secondaryTitle}>questions</h2>
          </div>

          <div className={styles.subtitleWrapper}>
            <p className={styles.subtitleSmall}>Some questions</p>
            <p className={styles.subtitleLarge}>PEOPLE USUALLY ASK</p>
          </div>
        </div>
      </header>

      <div className={styles.questionsContainer}>
        {questions.map((item, index) => (
          <QuestionItem
            key={index}
            question={item.question}
            answer={item.answer}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </div>
  )
}

export default CommonQuestions
