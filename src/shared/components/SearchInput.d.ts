/**
 * SearchInput Component
 * Input with search icon and auto-suggestions
 */
import React from 'react';
interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onSearch?: (query: string) => void;
    suggestions?: string[];
    onSelectSuggestion?: (suggestion: string) => void;
    loading?: boolean;
}
export declare const SearchInput: React.ForwardRefExoticComponent<SearchInputProps & React.RefAttributes<HTMLInputElement>>;
export default SearchInput;
//# sourceMappingURL=SearchInput.d.ts.map