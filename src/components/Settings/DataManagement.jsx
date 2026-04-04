import React, { useEffect, useRef, useState } from 'react'
import { storage } from '../../utils/storage'
import { useToast } from '../Common/Toast'
import './Settings.css'

/** Data export, import, and reset controls. */
export default function DataManagement() {
  const { showToast, Toasts } = useToast()
  const importRef = useRef(null)
  const [sizeKB, setSizeKB] = useState(0)

  useEffect(() => {
    storage.getSize().then(setSizeKB)
  }, [])

  const handleExport = async () => {
    try {
      const json = await storage.exportAll()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `englearn-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Data exported successfully!', 'success')
    } catch (e) {
      showToast('Export failed: ' + e.message, 'error')
    }
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const result = await storage.importAll(ev.target.result)
      if (result.success) {
        showToast('Data imported! Reloading…', 'success')
        setTimeout(() => window.location.reload(), 1200)
      } else {
        showToast(result.error, 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // reset input
  }

  const handleReset = async () => {
    if (window.confirm('Reset ALL data? This cannot be undone.')) {
      if (window.confirm('Are you absolutely sure? All vocabulary progress, notes, and settings will be lost.')) {
        await storage.clear()
        showToast('All data cleared. Reloading…', 'info')
        setTimeout(() => window.location.reload(), 1200)
      }
    }
  }

  return (
    <>
      <Toasts />
      <div className="data-management">
        <div className="storage-info">
          💾 Storage used: ~{sizeKB} KB
        </div>

        <div className="data-row">
          <div className="data-row-info">
            <div className="data-row-label">Export Data</div>
            <div className="data-row-desc">Download all your data as a JSON backup file</div>
          </div>
          <button className="btn btn-secondary" onClick={handleExport}>
            ⬇ Export
          </button>
        </div>

        <div className="data-row">
          <div className="data-row-info">
            <div className="data-row-label">Import Data</div>
            <div className="data-row-desc">Restore from a previously exported backup file</div>
          </div>
          <button className="btn btn-secondary" onClick={() => importRef.current?.click()}>
            ⬆ Import
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>

        <div className="data-row">
          <div className="data-row-info">
            <div className="data-row-label" style={{ color: 'var(--danger)' }}>Reset All Data</div>
            <div className="data-row-desc">Permanently delete all progress, notes, and settings</div>
          </div>
          <button className="btn btn-danger" onClick={handleReset}>
            🗑 Reset
          </button>
        </div>
      </div>
    </>
  )
}
