/**
 * @fileoverview Supabase-backed storage utilities with export/import support.
 */

import { supabase } from '../lib/supabase'
import { STORAGE_KEYS } from './constants'

const STORE_KEYS = Object.values(STORAGE_KEYS)

/** Map from Supabase key → store name (e.g. 'eng-vocab-store' → 'VOCAB') */
const keyToName = Object.fromEntries(
  Object.entries(STORAGE_KEYS).map(([name, key]) => [key, name])
)

export const storage = {
  /**
   * Export all app data as a JSON string for backup.
   * @returns {Promise<string>}
   */
  async exportAll() {
    const { data } = await supabase
      .from('app_storage')
      .select('key, value')
      .in('key', STORE_KEYS)

    const stores = {}
    data?.forEach(row => {
      stores[keyToName[row.key]] = row.value
    })

    return JSON.stringify(
      { exportedAt: new Date().toISOString(), version: '1.0', stores },
      null,
      2
    )
  },

  /**
   * Import data from a JSON backup string.
   * @param {string} jsonString
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async importAll(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      if (!data.stores) {
        return { success: false, error: 'Invalid backup format: missing stores object.' }
      }

      const rows = Object.entries(STORAGE_KEYS)
        .filter(([name]) => data.stores[name] !== undefined)
        .map(([name, key]) => ({
          key,
          value: data.stores[name],
          updated_at: new Date().toISOString(),
        }))

      if (rows.length > 0) {
        const { error } = await supabase
          .from('app_storage')
          .upsert(rows, { onConflict: 'key' })
        if (error) return { success: false, error: error.message }
      }

      return { success: true }
    } catch (e) {
      return { success: false, error: `Failed to parse backup: ${e.message}` }
    }
  },

  /**
   * Delete all app-related rows from Supabase.
   * @returns {Promise<void>}
   */
  async clear() {
    await supabase.from('app_storage').delete().in('key', STORE_KEYS)
  },

  /**
   * Get approximate storage size in KB from stored values.
   * @returns {Promise<number>}
   */
  async getSize() {
    const { data } = await supabase
      .from('app_storage')
      .select('value')
      .in('key', STORE_KEYS)

    const total = data?.reduce((sum, row) => sum + (row.value?.length ?? 0), 0) ?? 0
    return Math.round(total / 1024)
  },
}
