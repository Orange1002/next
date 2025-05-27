'use client'
import React, { useState, useEffect } from 'react'

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [replyInputs, setReplyInputs] = useState({})
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // 載入留言
  const fetchComments = async () => {
    try {
      setLoading(true)
      setErrorMsg('')
      const res = await fetch(
        `http://localhost:3005/api/article/reply/comments?article_id=${articleId}`,
        {
          credentials: 'include',
        }
      )

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg('請先登入')
        } else {
          setErrorMsg('載入留言失敗')
        }
        return
      }

      const data = await res.json()
      setComments(data)
    } catch (error) {
      console.error(error)
      setErrorMsg('載入留言發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (articleId) {
      fetchComments()
    }
  }, [articleId])

  // 新增留言
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    if (posting) return

    try {
      setPosting(true)
      setErrorMsg('')
      const res = await fetch(
        `http://localhost:3005/api/article/reply/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            article_id: articleId,
            content: newComment,
          }),
        }
      )

      if (!res.ok) {
        const error = await res.json()
        if (res.status === 401) {
          setErrorMsg('請先登入')
        } else {
          setErrorMsg(error.message || '留言失敗')
        }
        return
      }

      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('留言失敗', error)
      setErrorMsg('留言失敗，請稍後再試')
    } finally {
      setPosting(false)
    }
  }

  // 新增回覆
  const handleAddReply = async (parentId, e) => {
    e.preventDefault()
    const replyContent = replyInputs[parentId]
    if (!replyContent?.trim()) return
    if (posting) return

    try {
      setPosting(true)
      setErrorMsg('')
      const res = await fetch(
        `http://localhost:3005/api/article/reply/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            article_id: articleId,
            parent_id: parentId,
            content: replyContent,
          }),
        }
      )

      if (!res.ok) {
        const error = await res.json()
        if (res.status === 401) {
          setErrorMsg('請先登入')
        } else {
          setErrorMsg(error.message || '回覆失敗')
        }
        return
      }

      setReplyInputs({ ...replyInputs, [parentId]: '' })
      fetchComments()
    } catch (error) {
      console.error('回覆失敗', error)
      setErrorMsg('回覆失敗，請稍後再試')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="col-12 mt-5">
      <div className="mb-3 replay-area">
        <h6>留言區</h6>

        {errorMsg && (
          <div className="alert alert-danger" role="alert">
            {errorMsg}
          </div>
        )}

        {/* 留言輸入框 */}
        <form onSubmit={handleAddComment} className="comment-footer d-flex gap-2">
          <textarea
            className="form-control"
            placeholder="留下您的想法 🐶 ..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            disabled={posting}
          />
          <button type="submit" className="btn btn-primary replay-btn" disabled={posting}>
            {posting ? '送出中...' : '送出'}
          </button>
        </form>

        {/* 留言列表 */}
        {loading ? (
          <p>留言載入中...</p>
        ) : comments.length === 0 ? (
          <p>還沒有留言，快來留言吧！</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="card card-replay mt-3 p-1">
              <div className="card-body">
                <strong>{comment.author}：</strong>
                <p className="mt-2 mb-2">{comment.content}</p>

                {/* 回覆列表 */}
                <div className="reply-list ps-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="card mb-2 p-1 reply-box">
                      <div className="card-body">
                        <strong>{reply.author}：</strong>
                        <p className="mt-2 mb-2">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 回覆輸入框 */}
                <form
                  onSubmit={(e) => handleAddReply(comment.id, e)}
                  className="mt-2 reply-box"
                >
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="回覆這則留言..."
                      value={replyInputs[comment.id] || ''}
                      onChange={(e) =>
                        setReplyInputs({
                          ...replyInputs,
                          [comment.id]: e.target.value,
                        })
                      }
                      disabled={posting}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary replay-btn mt-1"
                    disabled={posting}
                  >
                    {posting ? '送出中...' : '送出'}
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection

// 'use client'
// import React, { useState } from 'react'

// const CommentSection = () => {
//   // 假留言初始資料
//   const [comments, setComments] = useState([
//     {
//       id: 1,
//       author: '使用者A',
//       content: '我家的狗狗冬天真的比較沒精神，謝謝分享！',
//       replies: [
//         {
//           id: 11,
//           author: '使用者B',
//           content: '我家也是，準備給牠吃溫補食物看看。',
//         },
//       ],
//     },
//     {
//       id: 2,
//       author: '使用者C',
//       content: '可以推薦哪些補品嗎？',
//       replies: [],
//     },
//   ])

//   const [newComment, setNewComment] = useState('')
//   const [replyInputs, setReplyInputs] = useState({}) // 儲存每則留言回覆輸入內容

//   // 新增留言
//   const handleAddComment = (e) => {
//     e.preventDefault()
//     if (!newComment.trim()) return

//     const newEntry = {
//       id: Date.now(),
//       author: '訪客', // 可以換成登入使用者名稱
//       content: newComment,
//       replies: [],
//     }
//     setComments([newEntry, ...comments])
//     setNewComment('')
//   }

//   // 新增回覆
//   const handleAddReply = (commentId, e) => {
//     e.preventDefault()
//     const replyContent = replyInputs[commentId]
//     if (!replyContent || !replyContent.trim()) return

//     const newReply = {
//       id: Date.now(),
//       author: '訪客',
//       content: replyContent,
//     }

//     const updatedComments = comments.map((comment) => {
//       if (comment.id === commentId) {
//         return {
//           ...comment,
//           replies: [...comment.replies, newReply],
//         }
//       }
//       return comment
//     })

//     setComments(updatedComments)
//     setReplyInputs({ ...replyInputs, [commentId]: '' })
//   }

//   return (
//     <div className="col-12 mt-5">
//       <div className="mb-3 replay-area">
//         <h6>留言區</h6>

//         {/* 留言輸入框 */}
//         <form
//           onSubmit={handleAddComment}
//           className="comment-footer d-flex gap-2"
//         >
//           <textarea
//             className="form-control"
//             placeholder="留下您的想法 🐶 ..."
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             rows={3}
//           />
//           <button type="submit" className="btn btn-primary replay-btn">
//             送出
//           </button>
//         </form>

//         {/* 留言列表 */}
//         {comments.length === 0 && <p>還沒有留言，快來留言吧！</p>}

//         {comments.map((comment) => (
//           <div key={comment.id} className="card card-replay mt-3 p-1">
//             <div className="card-body">
//               <strong>{comment.author}：</strong>
//               <p className="mt-2 mb-2">{comment.content}</p>

//               {/* 回覆列表 */}
//               <div className="reply-list ps-4">
//                 {comment.replies.map((reply) => (
//                   <div key={reply.id} className="card mb-2 p-1 reply-box">
//                     <div className="card-body">
//                       <strong>{reply.author}：</strong>
//                       <p className="mt-2 mb-2">{reply.content}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* 回覆輸入框 */}
//               <form
//                 onSubmit={(e) => handleAddReply(comment.id, e)}
//                 className="mt-2 reply-box"
//               >
//                 <div className="mb-2">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="回覆這則留言..."
//                     value={replyInputs[comment.id] || ''}
//                     onChange={(e) =>
//                       setReplyInputs({
//                         ...replyInputs,
//                         [comment.id]: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="btn btn-sm btn-primary replay-btn mt-1"
//                 >
//                   送出
//                 </button>
//               </form>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default CommentSection
