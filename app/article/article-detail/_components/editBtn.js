import React from 'react'
import Link from 'next/link'
import { FaPen } from 'react-icons/fa'
import '../_style/detail.scss'

const EditBtn = ({ id }) => {
  return (
    <Link href={`/article/update/${id}`} className="fab">
      <FaPen size={20} />
    </Link>
  )
}

export default EditBtn

// import React from 'react'
// import Link from 'next/link'
// import { FaPen } from 'react-icons/fa'
// import '../_style/detail.scss'

// const EditBtn = ({ id }) => {
//   return (
//     <Link href={`/article/update/${id}`} className="fab">
//       <FaPen size={20} />
//     </Link>
//   )
// }

// export default EditBtn
