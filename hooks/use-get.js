import { useState, useEffect } from 'react'

export function useGet(url, options) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url, options)
        const json = await res.json()
        setData(json)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }
    fetchData()
  }, [url, options])

  return { data, loading, error }
}
