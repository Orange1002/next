'use client'

import useHeaderPhoto from '../../_components/headerPhoto.js'
import Breadcrumb from '../../_components/breadCrumb.js'
import Articlelist from '../../_components/aricleList.js'
import PostArticle from '../_components/editArticle.js'
import Image from 'next/image.js'

import '../../_style/article.scss'
import '../_style/edit.scss'

const images = [
  '/article_img/d1e21f1a-4730-472b-8531-51b3c7b7890a.jpg',
  '/article_img/istockphoto-1300658241-612x612.jpg',
]
const breadcrumbItems = [
  { name: '首頁', href: '/' },
  { name: '文章', href: '/article' },
  { name: '發表新文章', href: '/article/update' },
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

          <div className="col-6 d-flex justify-content-end">
            {/* <form
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
            </form> */}
          </div>
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
