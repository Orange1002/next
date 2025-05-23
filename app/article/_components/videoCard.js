import React from 'react'
import { AiOutlineRightCircle } from 'react-icons/ai'
const VideoCard = () => {
  const videoUrl =
    'https://www.youtube.com/embed/DY-UslXiLKI?si=bTNtx1IZdls1JwD7'
  const title = '6個方法，徹底防衛致命的寄生蟲 | 狗主人必看必懂的一集！'

  return (
    <div>
      <div className="category d-flex justify-content-between mt-5 mb-5">
        <p className="">推薦知識影音</p>
        <div className="d-flex me-5">
          <p className="more">More</p>
          <button className="btn btn-link read-more rounded-circle d-flex justify-content-center align-items-center mt-1 ms-3">
            <a href="你的連結網址" className="icon-link">
              <AiOutlineRightCircle className="icon" />
            </a>
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="card mb-3 card-video mt-5">
          <div className="row g-0">
            <div className="col-md-12">
              <div className="ratio ratio-16x9">
                <iframe
                  width="100%"
                  height="500"
                  src={videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card-body">
                <h5 className="card-title">{title}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
