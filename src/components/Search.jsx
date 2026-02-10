import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '../hooks/useSearch'

const Search = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const resultsRef = useRef(null)
  const { results, popularSearches, totalResults, hasResults } =
    useSearch(query)

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset state when search closes
  useEffect(() => {
    return () => {
      if (!isOpen) {
        setQuery('')
        setSelectedIndex(0)
      }
    }
  }, [isOpen])

  const handleResultClick = useCallback(
    result => {
      navigate(result.href)
      onClose()
    },
    [navigate, onClose]
  )

  const handlePopularSearch = useCallback(searchTerm => {
    setQuery(searchTerm)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    e => {
      if (!isOpen) return

      const flatResults = results.flatMap(category => category.items)
      const totalFlatResults = flatResults.length + popularSearches.length

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => {
            const next = prev + 1
            return next < totalFlatResults ? next : 0
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => {
            const next = prev - 1
            return next >= 0 ? totalFlatResults - 1 : next
          })
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex < popularSearches.length && !query) {
            handlePopularSearch(popularSearches[selectedIndex])
          } else {
            const resultIndex = query
              ? selectedIndex
              : selectedIndex - popularSearches.length
            if (resultIndex >= 0 && resultIndex < flatResults.length) {
              handleResultClick(flatResults[resultIndex])
            }
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    },
    [
      handleResultClick,
      handlePopularSearch,
      selectedIndex,
      popularSearches,
      query,
      results,
      isOpen,
      onClose,
    ]
  )

  const highlightMatch = (text, query) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary font-semibold">
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    )
  }

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(
        '[data-selected="true"]'
      )
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Search Modal */}
          <motion.div
            initial={{ y: -25, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -25, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl mx-auto mt-20 px-4 sm:px-6 lg:px-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-border">
              {/* Search Input */}
              <div className="relative border-b border-border">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted text-lg" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value)
                    setSelectedIndex(0)
                  }}
                  placeholder="Search services, projects, FAQ, or pages..."
                  className="w-full pl-12 pr-20 py-4 text-lg border-0 focus:outline-none focus:ring-0 placeholder:text-ink-muted"
                  aria-label="Search input"
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-ink-muted hover:text-ink transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-sm outline-none"
                  aria-label="Close search"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              {/* Results */}
              <div
                ref={resultsRef}
                className="max-h-96 overflow-y-auto"
                role="listbox"
                aria-label="Search results"
              >
                {!query && (
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-ink-subtle uppercase tracking-[0.3em] mb-4">
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <button
                          key={search}
                          onClick={() => handlePopularSearch(search)}
                          className="px-3 py-1.5 text-sm bg-surface-2 text-ink-muted hover:text-ink hover:bg-surface-3 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-full outline-none"
                          data-selected={selectedIndex === index}
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query && (
                  <>
                    {hasResults ? (
                      <div className="py-2">
                        <p className="px-6 py-2 text-sm text-ink-muted">
                          Found {totalResults} result
                          {totalResults !== 1 ? 's' : ''}
                        </p>
                        {results.map((category, categoryIndex) => (
                          <div
                            key={category.category}
                            className="mb-6 last:mb-0"
                          >
                            <h3 className="px-6 py-2 text-sm font-semibold text-ink-subtle uppercase tracking-[0.3em]">
                              {category.category}
                            </h3>
                            <div>
                              {category.items.map((result, resultIndex) => {
                                const flatIndex =
                                  resultIndex +
                                  (categoryIndex === 0
                                    ? query
                                      ? 0
                                      : popularSearches.length
                                    : results
                                        .slice(0, categoryIndex)
                                        .reduce(
                                          (sum, cat) => sum + cat.items.length,
                                          0
                                        ) +
                                      (query ? 0 : popularSearches.length))

                                return (
                                  <button
                                    key={result.id}
                                    onClick={() => handleResultClick(result)}
                                    className="w-full px-6 py-3 text-left hover:bg-surface-2 transition-colors focus:bg-surface-2 focus:outline-none group"
                                    data-selected={selectedIndex === flatIndex}
                                    role="option"
                                    aria-selected={selectedIndex === flatIndex}
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-ink group-hover:text-primary transition-colors">
                                          {highlightMatch(result.title, query)}
                                        </h4>
                                        {result.description && (
                                          <p className="text-sm text-ink-muted mt-1 line-clamp-2">
                                            {highlightMatch(
                                              result.description,
                                              query
                                            )}
                                          </p>
                                        )}
                                        <p className="text-xs text-ink-subtle mt-1">
                                          {result.category}
                                        </p>
                                      </div>
                                      <FaArrowRight className="text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity text-xs mt-1 flex-shrink-0" />
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-ink mb-2">
                          No results found
                        </h3>
                        <p className="text-ink-muted">
                          Try different keywords or browse our popular searches
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Keyboard Shortcuts Hint */}
              <div className="border-t border-border px-6 py-3 bg-surface-1">
                <div className="flex items-center justify-between text-xs text-ink-subtle">
                  <div className="flex items-center gap-4">
                    <span>↑↓ Navigate</span>
                    <span>↵ Select</span>
                    <span>ESC Close</span>
                  </div>
                  <div>
                    Press{' '}
                    <kbd className="px-2 py-0.5 bg-surface-2 rounded">Ctrl</kbd>{' '}
                    +
                    <kbd className="px-2 py-0.5 bg-surface-2 rounded ml-1">
                      K
                    </kbd>{' '}
                    to search
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Search
