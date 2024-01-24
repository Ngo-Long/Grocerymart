import { $ } from './common';

export function registerPagination({ elementId, defaultParams, totalCount, onChange }) {
  // Get the element
  const paginationElement = $(elementId);
  if (!paginationElement || !defaultParams || !onChange) return;

  // Calc total pages
  const page = Number.parseInt(defaultParams.get('_page'));
  const limit = Number.parseInt(defaultParams.get('_limit'));
  const totalPages = Math.ceil(Number.parseInt(totalCount) / limit);

  renderPagination(paginationElement, totalPages);
  attachEventClickButtons(paginationElement, page, totalPages, onChange);
}

function renderPagination(paginationElement, totalPages) {
  if (!paginationElement || !totalPages) return;

  // Reset the pagination
  paginationElement.innerHTML = '';

  // Add button first
  paginationElement.innerHTML +=
    '<button value="1" class="page-item page-link">&laquo; Prev</button>';

  // Add numbered buttons
  for (let i = 1; i <= totalPages; i++) {
    paginationElement.innerHTML += `<button value="${i}" class="page-item page-link">${i}</button>`;
  }

  // Add button last
  paginationElement.innerHTML += `<button value ="${totalPages}" class="page-item page-link">Next &raquo;</button>`;
}

function attachEventClickButtons(paginationElement, currentPage, totalPages, onChange) {
  if (!paginationElement || !onChange) return;

  const resetActive = () => {
    const buttonList = paginationElement.querySelectorAll('.page-item.page-link');
    buttonList.forEach((button) => button.classList.remove('active'));
  };

  // Get number button elements page
  const numberButtons = paginationElement.querySelectorAll(
    '.page-item.page-link:not(:first-child):not(:last-child)',
  );

  // Add class 'active' when web start
  numberButtons[currentPage - 1].classList.add('active');

  // Attach event click for numbered buttons
  numberButtons?.forEach((button) => {
    const pageNum = Number.parseInt(button.value);

    button.addEventListener('click', () => {
      resetActive();

      // Add class 'active' new button
      numberButtons[pageNum - 1].classList.add('active');

      onChange?.(pageNum);
    });
  });

  const prevBtn = paginationElement.firstElementChild;
  const nextBtn = paginationElement.lastElementChild;

  // check if disable prev or next links
  currentPage <= 1 ? prevBtn?.classList.add('disabled') : prevBtn?.classList.remove('disabled');
  currentPage >= totalPages
    ? nextBtn?.classList.add('disabled')
    : nextBtn?.classList.remove('disabled');

  // Attach event click button first
  if (currentPage >= 2) prevBtn?.addEventListener('click', () => onChange?.(currentPage - 1));
  if (currentPage < totalPages)
    nextBtn?.addEventListener('click', () => onChange?.(currentPage + 1));
}
