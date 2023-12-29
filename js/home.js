import productApi from './api/productApi';
import {
  startCarousel,
  setElementSourceBySelector,
  setElementTextContent,
  getPaginationElement,
} from './utils/index';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // to use fromNow function

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function isFavoriteProductElement(container, selector, isFavorite) {
  if (!container || typeof isFavorite !== 'boolean') return;

  const targetElement = container.querySelector(selector);
  if (!targetElement) return;

  // Add or remove classes  depending on the value of isFavorite
  return isFavorite === true
    ? targetElement.classList.add('like-btn--liked')
    : targetElement.classList.remove('like-btn--liked');
}

function createProductItem(dataItem) {
  if (!dataItem) return;

  // Get id product template
  const productTemplate = $('#productTemplate');
  if (!productTemplate) return;

  // Get in content product template
  const productItem = productTemplate.content.firstElementChild.cloneNode(true);
  if (!productItem) return;

  // Update title, brand, price, score, imageUrl, description, thumbList
  setElementTextContent(productItem, '[data-id="titleProduct"]', dataItem.title);
  setElementTextContent(productItem, '[data-id="priceProduct"]', dataItem.price);
  setElementTextContent(productItem, '[data-id="brandProduct"]', dataItem.brand);
  setElementTextContent(productItem, '[data-id="scoreProduct"]', dataItem.score);
  setElementTextContent(productItem, '[data-id="descProduct"]', dataItem.description);

  setElementSourceBySelector(productItem, '[data-id="imageUrlProduct"]', dataItem.imageUrl);
  isFavoriteProductElement(productItem, '[data-id="isFavoriteProduct"]', dataItem.isFavorite);

  // calulate timespan
  // console.log('timespan', dayjs(dataItem.updatedAt).fromNow());

  return productItem;
}

function renderProductList(elementId, dataList) {
  if (!elementId || !Array.isArray(dataList) || !dataList.length) return;

  // product list element
  const productList = $(elementId);
  if (!productList) return;

  // Clear current product list
  productList.textContent = '';

  // get each data in dataList
  dataList.forEach((dataItem) => {
    const productItem = createProductItem(dataItem);

    // append productItem in productList
    productList.appendChild(productItem);
  });
}

function initPagination() {
  const paginationElement = getPaginationElement();
  if (!paginationElement) return;

  const prevBtn = paginationElement.firstElementChild?.firstElementChild;
  if (prevBtn) prevBtn.addEventListener('click', handlePrevClick);

  const nextBtn = paginationElement.lastElementChild?.firstElementChild;
  if (nextBtn) nextBtn.addEventListener('click', handleNextClick);
}

function handleNextClick(e) {
  e.preventDefault();

  const paginationElement = getPaginationElement();
  if (!paginationElement) return;

  const page = Number.parseInt(paginationElement.dataset.page) || 1;
  const totalPages = Number.parseInt(paginationElement.dataset.totalPages);
  if (page >= totalPages) return;

  handleFilterChange('_page', page + 1);
}

function handlePrevClick(e) {
  e.preventDefault();

  const paginationElement = getPaginationElement();
  if (!paginationElement) return;

  const page = Number.parseInt(paginationElement.dataset.page) || 1;
  if (page <= 1) return;

  handleFilterChange('_page', page - 1);
}

async function handleFilterChange(filterName, filterValue) {
  try {
    // Update query parameters
    const url = new URL(window.location);
    const queryParams = url.searchParams;
    queryParams.set(filterName, filterValue);

    history.pushState({}, '', url);

    // Fetch API
    // re-render product list
    const { data, totalCount } = await productApi.getAll(queryParams);

    renderProductList('#productList', data);
    renderPagination('#productsPagination', totalCount, queryParams);
  } catch (error) {
    console.log('Failded to fetch product list: ', error);
  }
}

function renderPagination(elementId, totalCount, queryParams) {
  if (!elementId || !totalCount || !queryParams) return;

  // calc total pages
  const page = queryParams.get('_page');
  const limit = queryParams.get('_limit');
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

// TODO: MAIN
// asynchronous function that make HTTP requests use axiosClient
(async () => {
  try {
    const url = new URL(window.location);

    // set default pagination (_limit, _page) on URL
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 8);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    const { data, totalCount } = await productApi.getAll(queryParams);

    startCarousel({
      carouselId: '#carousel-id',
      carouselItem: '.carousel__item',
      selectorPrev: 'button[data-bs-slide="prev"]',
      selectorNext: 'button[data-bs-slide="next"]',
    });

    initPagination();
    renderProductList('#productList', data);
    renderPagination('#productsPagination', totalCount, queryParams);
  } catch (error) {
    console.log('Get all failed', error);
  }
})();
