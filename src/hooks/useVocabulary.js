/**
 * @fileoverview Hook for vocabulary filtering, sorting, and favorites management.
 */
import { useState, useMemo, useCallback } from 'react'
import { useVocabStore } from '../store/vocabStore'
import { getSRSStatus } from '../utils/srsAlgorithm'

/**
 * @returns {{
 *   vocabulary: Array,
 *   filtered: Array,
 *   search: string,
 *   setSearch: function,
 *   category: string,
 *   setCategory: function,
 *   sortBy: string,
 *   setSortBy: function,
 *   showFavorites: boolean,
 *   setShowFavorites: function,
 *   favorites: number[],
 *   toggleFavorite: function,
 *   getWord: function
 * }}
 */
export function useVocabulary() {
  const vocabulary = useVocabStore(s => s.vocabulary)
  const favorites = useVocabStore(s => s.favorites)
  const toggleFavorite = useVocabStore(s => s.toggleFavorite)
  const getWord = useVocabStore(s => s.getWord)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('alpha')
  const [showFavorites, setShowFavorites] = useState(false)

  const filtered = useMemo(() => {
    let result = [...vocabulary]

    // Filter by favorites
    if (showFavorites) {
      result = result.filter(w => favorites.includes(w.id))
    }

    // Filter by category
    if (category !== 'all') {
      result = result.filter(w => w.category === category)
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(
        w =>
          w.term.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q)
      )
    }

    // Sort
    switch (sortBy) {
      case 'alpha':
        result.sort((a, b) => a.term.localeCompare(b.term))
        break
      case 'srs': {
        const order = { new: 0, learning: 1, mastered: 2 }
        result.sort((a, b) => {
          const sa = order[getSRSStatus(a.interval)] ?? 0
          const sb = order[getSRSStatus(b.interval)] ?? 0
          return sa - sb || a.term.localeCompare(b.term)
        })
        break
      }
      case 'due':
        result.sort((a, b) => a.nextReview - b.nextReview)
        break
      default:
        break
    }

    return result
  }, [vocabulary, favorites, search, category, sortBy, showFavorites])

  const handleToggleFavorite = useCallback((id) => {
    toggleFavorite(id)
  }, [toggleFavorite])

  return {
    vocabulary,
    filtered,
    search,
    setSearch,
    category,
    setCategory,
    sortBy,
    setSortBy,
    showFavorites,
    setShowFavorites,
    favorites,
    toggleFavorite: handleToggleFavorite,
    getWord,
  }
}
