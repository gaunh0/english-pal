/**
 * @fileoverview Custom Zustand persist storage adapter backed by Supabase.
 *
 * Requires an `app_storage` table in Supabase:
 *   CREATE TABLE app_storage (
 *     key TEXT PRIMARY KEY,
 *     value TEXT NOT NULL,
 *     updated_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 */

import { supabase } from './supabase'

export const supabaseStorage = {
  /** @param {string} name @returns {Promise<string|null>} */
  async getItem(name) {
    const { data } = await supabase
      .from('app_storage')
      .select('value')
      .eq('key', name)
      .maybeSingle()
    return data?.value ?? null
  },

  /** @param {string} name @param {string} value */
  async setItem(name, value) {
    await supabase
      .from('app_storage')
      .upsert(
        { key: name, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
  },

  /** @param {string} name */
  async removeItem(name) {
    await supabase.from('app_storage').delete().eq('key', name)
  },
}
