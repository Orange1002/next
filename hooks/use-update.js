import { useState, useEffect, useRef, useMemo } from 'react'

export function useGet(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const prevDataRef = useRef(null)

  // ✅ 記憶化 options，避免每次都變動
  const memoOptions = useMemo(() => options, [options])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(url, memoOptions)
        if (!res.ok) throw new Error('Fetch failed')
        const json = await res.json()

        const isSameData =
          JSON.stringify(prevDataRef.current) === JSON.stringify(json)
        if (!isSameData) {
          setData(json)
          prevDataRef.current = json
        }
      } catch (err) {
        setError(err.message || 'Fetch error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, memoOptions]) // ✅ 現在你可以安全放 memoOptions

  return { data, loading, error }
}
