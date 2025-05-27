import React from 'react'
import '../_style/myarticle.scss'
// import '@fortawesome/fontawesome-free/css/all.min.css'

const ButtonGroup = () => {
  return (
    <div className="d-flex justify-content-evenly gap-3 mt-4">
      <button type="button" className="btn list-btn">
        飲食與營養
      </button>
      <button type="button" className="btn list-btn">
        行為與訓練
      </button>
      <button type="button" className="btn list-btn">
        健康與保健
      </button>
      <button type="button" className="btn list-btn">
        戶外活動與探險
      </button>
    </div>
  )
}

export default ButtonGroup
