import { $ } from './common';
import debounce from 'lodash.debounce';

export function registerSearchInput({ elementsId, defaultParams, onChange }) {
  if (!Array.isArray(elementsId) || !elementsId.length) return;

  const searchInput = $(elementsId[0]);
  const btnSearch = $(elementsId[1]);

  if (!searchInput || !btnSearch) return;

  // Keep the search value intact the intact when the pages is loaded
  if (defaultParams.get('title_like') && defaultParams) {
    searchInput.value = defaultParams.get('title_like');
  }

  // Call debounced search 500s
  const debouncedSearch = debounce((e) => {
    const valueText = e.target.value.replace(/\s+/g, ' ').trim();
    onChange?.(valueText);
  }, 500);

  // Button submit search
  const submitSearch = (e) => {
    e.preventDefault();

    const valueText = searchInput.value.replace(/\s+/g, ' ').trim();
    onChange?.(valueText);
  };

  // Attach event search input
  btnSearch.addEventListener('click', submitSearch);
  searchInput.addEventListener('input', debouncedSearch);
}

export function handleSelectChange({ elementsId, defaultParams, filterType, onChange }) {
  if (!Array.isArray(elementsId) || !elementsId.length) return;
  if (!filterType || !onChange) return;

  const selectElementId = $(elementsId[0]);
  const btnTagId = $(elementsId[1]);

  if (!selectElementId || !btnTagId) return;

  // Keep the selected value intact the intact when the pages is loaded
  if (defaultParams.get(filterType) && defaultParams) {
    selectElementId.value = defaultParams.get(filterType);
  }

  // Attach event search input
  selectElementId.addEventListener('change', (e) => onChange?.(e.target.value));

  btnTagId.addEventListener('click', (e) => {
    const optionElement = selectElementId.querySelector(`option[value="${e.target.value}"]`);
    if (optionElement) optionElement.selected = true;

    onChange?.(e.target.value);
  });
}
