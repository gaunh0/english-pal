/**
 * @fileoverview localStorage helper utilities with error handling and export/import support.
 */

import { STORAGE_KEYS } from './constants'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB warning threshold

/** Safe localStorage wrapper */
export const storage = {
  /**
   * Get a value from localStorage, returning defaultValue on error.
   * @param {string} key
   * @param {*} defaultValue
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  /**
   * Set a value in localStorage, handling quota exceeded errors.
   * @param {string} key
   * @param {*} value
   * @returns {boolean} Whether the operation succeeded
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider exporting and clearing data.')
      } else {
        console.error('localStorage.set error:', e)
      }
      return false
    }
  },

  /**
   * Remove a key from localStorage.
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('localStorage.remove error:', e)
    }
  },

  /**
   * Clear all app-related keys from localStorage.
   */
  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
    } catch (e) {
      console.error('localStorage.clear error:', e)
    }
  },

  /**
   * Export all app data as a JSON string for backup.
   * @returns {string} JSON string of all app stores
   */
  exportAll() {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      stores: {},
    }
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      data.stores[name] = this.get(key)
    })
    return JSON.stringify(data, null, 2)
  },

  /**
   * Import data from a JSON backup string.
   * @param {string} jsonString - Previously exported JSON string
   * @returns {{ success: boolean, error?: string }}
   */
  importAll(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      if (!data.stores) {
        return { success: false, error: 'Invalid backup format: missing stores object.' }
      }
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        if (data.stores[name] !== undefined) {
          this.set(key, data.stores[name])
        }
      })
      return { success: true }
    } catch (e) {
      return { success: false, error: `Failed to parse backup: ${e.message}` }
    }
  },

  /**
   * Get estimated total localStorage usage in KB.
   * @returns {number}
   */
  getSize() {
    try {
      let total = 0
      for (let key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          total += (localStorage[key].length + key.length) * 2
        }
      }
      return Math.round(total / 1024)
    } catch {
      return 0
    }
  },

  /**
   * Check if storage is near capacity (> 80% of 5MB).
   * @returns {boolean}
   */
  isNearCapacity() {
    return this.getSize() * 1024 > MAX_SIZE_BYTES * 0.8
  },
}
