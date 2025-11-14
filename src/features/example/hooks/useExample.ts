import { useState, useEffect } from 'react'
import { Example } from '../types'
import { exampleService } from '../services/exampleService'

export const useExample = () => {
  const [examples, setExamples] = useState<Example[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExamples = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await exampleService.getAll()
      setExamples(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch examples')
    } finally {
      setLoading(false)
    }
  }

  const updateExampleStatus = async (
    id: string,
    status: Example['status']
  ) => {
    try {
      await exampleService.update(id, { status })
      setExamples((prev) =>
        prev.map((ex) => (ex.id === id ? { ...ex, status } : ex))
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update example'
      )
    }
  }

  useEffect(() => {
    fetchExamples()
  }, [])

  return {
    examples,
    loading,
    error,
    refetch: fetchExamples,
    updateStatus: updateExampleStatus,
  }
}
