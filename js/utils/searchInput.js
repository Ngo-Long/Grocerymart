import { $ } from './common';
import debounce from 'lodash.debounce';

export function registerSearchInput({ elementId, defaultParams, onChange }) {
  const searchInput = $(elementId);
  if (!searchInput) return;

  // Keep the search value intact the intact when the pages is loaded
  if (defaultParams && defaultParams.get('title-like')) {
    searchInput.value = defaultParams.get('title-like');
  }

  // Call debounced search 500s
  const debouncedSearch = debounce((e) => onChange?.(e.target.value), 500);

  // Attach event search input
  searchInput.addEventListener('input', debouncedSearch);
}
