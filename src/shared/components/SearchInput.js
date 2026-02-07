import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * SearchInput Component
 * Input with search icon and auto-suggestions
 */
import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
const SearchIcon = (props) => (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", ...props, children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.35-4.35" })] }));
export const SearchInput = React.forwardRef(({ onSearch, suggestions = [], onSelectSuggestion, loading = false, className, ...props }, ref) => {
    const [value, setValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        onSearch?.(newValue);
    };
    const handleSelectSuggestion = (suggestion) => {
        setValue(suggestion);
        onSelectSuggestion?.(suggestion);
        setIsOpen(false);
    };
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (_jsxs("div", { ref: containerRef, className: "relative", children: [_jsxs("div", { className: "relative", children: [_jsx(SearchIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" }), _jsx("input", { ref: ref, type: "text", value: value, onChange: handleChange, onFocus: () => setIsOpen(true), className: clsx('w-full pl-10 pr-3 py-2.5 rounded-lg border transition-colors', 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500', 'border-gray-300 dark:border-gray-600', 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent', 'disabled:opacity-50 disabled:cursor-not-allowed', className), ...props }), loading && (_jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: _jsx("div", { className: "animate-spin w-4 h-4 border-2 border-transparent border-r-primary-500 rounded-full" }) }))] }), isOpen && suggestions.length > 0 && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50", children: _jsx("ul", { className: "max-h-48 overflow-y-auto", children: suggestions.map((suggestion, index) => (_jsx("li", { children: _jsx("button", { type: "button", onClick: () => handleSelectSuggestion(suggestion), className: "w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-white text-sm", children: suggestion }) }, index))) }) }))] }));
});
SearchInput.displayName = 'SearchInput';
export default SearchInput;
//# sourceMappingURL=SearchInput.js.map