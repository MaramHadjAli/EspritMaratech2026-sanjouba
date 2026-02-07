/**
 * SearchInput Component
 * Input with search icon and auto-suggestions
 */

import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (query: string) => void
  suggestions?: string[]
  onSelectSuggestion?: (suggestion: string) => void
  loading?: boolean
}

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { onSearch, suggestions = [], onSelectSuggestion, loading = false, className, ...props },
    ref
  ) => {
    const [value, setValue] = useState<string>('')
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      onSearch?.(newValue)
    }

    const handleSelectSuggestion = (suggestion: string) => {
      setValue(suggestion)
      onSelectSuggestion?.(suggestion)
      setIsOpen(false)
    }

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
      <div ref={containerRef} className="relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsOpen(true)}
            className={clsx(
              'w-full pl-10 pr-3 py-2.5 rounded-lg border transition-colors',
              'bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500',
              'border-gray-300 dark:border-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />

          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-transparent border-r-primary-500 rounded-full" />
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
            <ul className="max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-white text-sm"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export default SearchInput
