import { $ } from './common';
import debounce from 'lodash.debounce';

export function registerSearchInput({ elementId, defaultParams, onChange }) {
  const searchInput = $(elementId);
  if (!searchInput) return;

  // Keep the search value intact the intact when the pages is loaded
  if (defaultParams.get('title_like') && defaultParams) {
    searchInput.value = defaultParams.get('title_like');
  }

  // Call debounced search 500s
  const debouncedSearch = debounce((e) => {
    const valueText = e.target.value.replace(/\s+/g, ' ').trim();
    onChange?.(valueText);
  }, 500);

  // Attach event search input
  searchInput.addEventListener('input', debouncedSearch);
}

export function handleSelectChange({ elementId, defaultParams, onChange }) {
  const selectId = $(elementId);
  if (!selectId) return;

  // Keep the selected value intact the intact when the pages is loaded
  if (defaultParams.get('brand') && defaultParams) {
    selectId.value = defaultParams.get('brand');
  }

  // Attach event search input
  selectId.addEventListener('change', (e) => {
    onChange?.(e.target.value);
  });
}
