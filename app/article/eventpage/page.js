'use client'

import useHeaderPhoto from '../_components/headerPhoto.js'
import Breadcrumb from '../_components/breadCrumb.js'
import Articlelist from '../_components/aricleList.js'
import EventCard from './_components/eventCard.js'
import Image from 'next/image'

// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../_style/article.scss'
import './_style/eventpage.scss'

const images = [
  '/article_img/d1e21f1a-4730-472b-8531-51b3c7b7890a.jpg',
  '/article_img/istockphoto-1300658241-612x612.jpg',
]

function ArticleHeaderPhoto() {
  const currentIndex = useHeaderPhoto(images.length)

  return (
    <>
      <div className="container-fluid desktop">
        <div className="headerphoto d-none d-sm-block">
          {images.map((src, index) => (
            <Image
              width={100}
              height={100}
              key={index}
              src={src}
              alt={`header-img-${index + 1}`}
              className={`w-100 ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
      <div className="container desktop">
        <div className="row">
          <div className="col-6">
            <Breadcrumb />
          </div>

          <div className="col-6 d-flex justify-content-end">
            <form
              className="d-flex card-search ms-auto gap-2 mt-5"
              role="search"
            >
              <div className="input-group">
                <input
                  className="form-control rounded-pill"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                  type="submit"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-5 row mb-5">
          <div className="col-2">
            <Articlelist />
          </div>
          <div className="col-10 mx-auto">
            <div className="category d-flex justify-content-between mb-3">
              <p className="fs-4 fw-bold">活動主打星</p>
            </div>
            <div className="event-list d-flex flex-wrap gap-4">
              <EventCard
                imageSrc="../article_img/AIRBUGGY1 2.png"
                title="外出必備!! 春日好禮大放送！"
              />
            </div>
            {/* 熱烈進行中 */}
            <div className="category d-flex justify-content-between mt-5 mb-3">
              <p className="fs-4 fw-bold">熱烈進行中</p>
            </div>
            <div className="event-list d-flex flex-wrap gap-4">
              <EventCard
                imageSrc="../article_img/AIRBUGGY1 1.png"
                title="春季_狗狗新裝上線!!"
              />
              <EventCard
                imageSrc="../article_img/AIRBUGGY1 2.png"
                title="外出必備!! 春日好禮大放送！"
              />
              <EventCard
                imageSrc="../article_img/AIRBUGGY1 3.png"
                title="達指定金額 運費$0元！"
              />
            </div>

            {/* 分隔線 */}
            <hr className="my-5" />

            {/* 活動預告 */}
            <div className="category d-flex justify-content-between mb-3">
              <p className="fs-4 fw-bold">活動預告</p>
            </div>
            <div className="event-list d-flex flex-wrap gap-4">
              <EventCard
                imageSrc="../article_img/AIRBUGGY1 3.png"
                title="達指定金額 運費$0元！"
              />
              <EventCard
                imageSrc="../article_img/AIRBUGGY1 3.png"
                title="達指定金額 運費$0元！"
              />
            </div>
            <hr className="my-5" />
          </div>
        </div>
      </div>
    </>
  )
}

export default ArticleHeaderPhoto
