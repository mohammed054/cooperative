import { FaSearch } from 'react-icons/fa'

export const SearchButton = ({ onClick, isLight = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none px-3 py-1 ${
        isLight
          ? 'text-white/80 hover:text-white'
          : 'text-ink-muted hover:text-ink'
      } ${className}`}
      aria-label="Open search (Ctrl+K)"
    >
      <FaSearch className="text-xs" />
      <span className="hidden sm:inline">Search</span>
    </button>
  )
}
