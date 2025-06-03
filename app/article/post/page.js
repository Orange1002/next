'use client'

import useHeaderPhoto from '../_components/headerPhoto.js'
import Breadcrumb from '../_components/breadCrumb.js'
import Articlelist from '../_components/aricleList.js'
import PostArticle from './_components/postArticle.js'
import Image from 'next/image.js'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../_style/article.scss'
import '../post/_style/post.scss'

// import { Pagination } from 'react-bootstrap'

const images = [
  '/article_img/IMG_8676-scaled-1.jpg',
  '/article_img/main_img_202011.jpg',
  // '/article_img/news-1.jpg',
]

const breadcrumbItems = [
  { name: '首頁', href: '/' },
  { name: '文章', href: '/article' },
  { name: '發表新文章', href: '/article/post' },
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
      <div className="container desktop mb-5">
        <div className="row">
          <div className="col-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="col-6 d-flex justify-content-end"></div>
        </div>
        <div className="mt-5 row">
          <div className="col-2">
            <Articlelist />
          </div>
          <div className="col-10">
            <PostArticle />
          </div>
        </div>
      </div>
    </>
  )
}

export default ArticleHeaderPhoto
