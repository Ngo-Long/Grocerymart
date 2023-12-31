import { $ } from './common';

export function initPagination({ elementId, defaultParams, onChange }) {
  if (!elementId || !defaultParams) return;

  const paginationElement = $(elementId);
  if (!paginationElement) return;

  // Add click event for prev link
  const prevBtn = paginationElement?.firstElementChild?.firstElementChild;
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const page = Number.parseInt(paginationElement.dataset.page) || 1;
      if (page >= 2) onChange?.(page - 1);
    });
  }

  // Add click event for next link
  const nextBtn = paginationElement?.lastElementChild?.firstElementChild;
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const page = Number.parseInt(paginationElement.dataset.page) || 1;
      const totalPages = Number.parseInt(paginationElement.dataset.totalPages);

      if (page < totalPages) onChange?.(page + 1);
    });
  }
}

export function renderPagination({ elementId, defaultParams, totalCount }) {
  if (!elementId || !defaultParams || !totalCount) return;

  // calc total pages
  const page = defaultParams.get('_page');
  const limit = defaultParams.get('_limit');
  const totalPages = Math.ceil(totalCount / limit);

  const paginationElement = $(elementId);
  if (!paginationElement) return;

  // save page and totalPages to paginationElement
  paginationElement.dataset.page = page;
  paginationElement.dataset.limit = limit;
  paginationElement.dataset.totalPages = totalPages;

  // check if disable prev links
  const prevLink = paginationElement?.firstElementChild?.firstElementChild;
  page <= 1 ? prevLink.classList.add('disabled') : prevLink.classList.remove('disabled');

  // check if disable next links
  const nextLink = paginationElement?.lastElementChild?.firstElementChild;
  page >= totalPages ? nextLink.classList.add('disabled') : nextLink.classList.remove('disabled');
}
