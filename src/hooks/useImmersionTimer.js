import { useEffect, useRef } from 'react'
import { useSettingsStore } from '../store/settingsStore'

/**
 * Tracks time spent on a skill view and records it on unmount.
 * @param {'shadowing'|'reading'|'dictation'|'journal'} skill
 */
export function useImmersionTimer(skill) {
  const recordImmersionTime = useSettingsStore(s => s.recordImmersionTime)
  const startRef = useRef(Date.now())

  useEffect(() => {
    startRef.current = Date.now()
    return () => {
      const seconds = Math.round((Date.now() - startRef.current) / 1000)
      if (seconds >= 5) recordImmersionTime(skill, seconds)
    }
  }, [skill, recordImmersionTime])
}
