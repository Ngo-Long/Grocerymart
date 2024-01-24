import { $ } from './common';

export function updatePaginationUI({ elementId, defaultParams, totalCount }) {
  const paginationElement = $(elementId);
  if (!paginationElement || !defaultParams || !totalCount) return;

  // Calc total pages
  const page = defaultParams.get('_page');
  const limit = defaultParams.get('_limit');
  const totalPages = Math.ceil(totalCount / limit);

  // Save page and totalPages to paginationElement
  paginationElement.dataset.page = page;
  paginationElement.dataset.limit = limit;
  paginationElement.dataset.totalPages = totalPages;

  // check if disable prev or next links
  const prevLink = paginationElement?.firstElementChild;
  page <= 1 ? prevLink?.classList.add('disabled') : prevLink?.classList.remove('disabled');

  const nextLink = paginationElement?.lastElementChild;
  page >= totalPages ? nextLink?.classList.add('disabled') : nextLink?.classList.remove('disabled');
}

export function registerPagination({ elementId, defaultParams, onChange }) {
  // Get the element
  const paginationElement = $(elementId);
  if (!paginationElement || !defaultParams || !onChange) return;

  let page = Number.parseInt(paginationElement.dataset.page) || 1;
  const totalPages = Number.parseInt(paginationElement.dataset.totalPages);

  renderPagination(paginationElement, totalPages);
  attachEventClickButtons(paginationElement, onChange);
}

function renderPagination(paginationElement, totalPages) {
  if (!paginationElement || !totalPages) return;

  // Reset the pagination
  paginationElement.innerHTML = '';

  // Add button first
  paginationElement.innerHTML +=
    '<button value="1" class="page-item page-link">&laquo; First</button>';

  // Add numbered buttons
  for (let i = 1; i <= totalPages; i++) {
    paginationElement.innerHTML += `<button value="${i}" class="page-item page-link">${i}</button>`;
  }

  // Add button last
  paginationElement.innerHTML += `<button value ="${totalPages}" class="page-item page-link">Last &raquo;</button>`;
}

function attachEventClickButtons(paginationElement, onChange) {
  if (!paginationElement || !onChange) return;

  let currentPage = Number.parseInt(paginationElement.dataset.page) || 1;
  const totalPages = Number.parseInt(paginationElement.dataset.totalPages);

  const resetActive = () => {
    const buttonList = paginationElement.querySelectorAll('.page-item.page-link');
    buttonList.forEach((button) => button.classList.remove('active'));
  };

  // Get number button elements page
  const numberButtons = paginationElement.querySelectorAll('.page-item.page-link');

  // Attach class 'active' when web start
  numberButtons[currentPage].classList.add('active');

  // Attach event click for numbered buttons
  numberButtons?.forEach((button) => {
    const pageNum = Number.parseInt(button.value);

    button.addEventListener('click', () => {
      resetActive();
      numberButtons[pageNum].classList.add('active');

      onChange?.(pageNum);
    });
  });

  // Attach event click button first
  const firstButton = paginationElement.firstElementChild;
  firstButton?.addEventListener('click', () => {
    currentPage = Number.parseInt(paginationElement.dataset.page) || 1;

    if (currentPage >= 2) onChange?.(currentPage - 1);
  });

  // Attach event click button last
  const lastButton = paginationElement.lastElementChild;
  lastButton?.addEventListener('click', () => {
    currentPage = Number.parseInt(paginationElement.dataset.page) || 1;

    if (currentPage < totalPages) onChange?.(currentPage + 1);
  });
}
