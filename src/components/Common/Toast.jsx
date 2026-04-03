import React, { useState, useCallback, useEffect } from 'react'
import './Common.css'

const ICONS = { success: '✅', error: '❌', info: 'ℹ️' }

/** Individual toast notification. */
function Toast({ message, type = 'info', onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-icon">{ICONS[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-dismiss" onClick={onDismiss} aria-label="Dismiss">✕</button>
    </div>
  )
}

/** Toast container — renders all active toasts. */
export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  )
}

let _toastCounter = 0

/**
 * Hook providing showToast + ToastContainer rendering.
 * @returns {{ toasts: Array, showToast: function, ToastContainer: function }}
 */
export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = ++_toastCounter
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const Toasts = useCallback(() => (
    <ToastContainer toasts={toasts} onDismiss={dismissToast} />
  ), [toasts, dismissToast])

  return { toasts, showToast, Toasts }
}
