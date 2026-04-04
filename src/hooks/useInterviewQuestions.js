import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useInterviewQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('interview_questions').select('*').order('id')
      .then(({ data }) => {
        setQuestions(data ?? [])
        setLoading(false)
      })
  }, [])

  return { questions, loading }
}
