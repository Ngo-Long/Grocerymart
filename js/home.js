import productApi from './api/productApi';
import { startCarousel, setElementSourceBySelector, setElementTextContent } from './utils/index.js';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // to use fromNow function

// NOTE: TODO: FIXME:
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

function renderProductList(dataList) {
  if (!Array.isArray(dataList) || !dataList.length) return;

  // product List
  const productList = $('#productList');
  if (!productList) return;

  dataList.forEach((dataItem) => {
    const productItem = createProductItem(dataItem);

    productList.appendChild(productItem);
  });
}

function initPagination({ elementId }) {
  if (!elementId) return;

  const paginationElement = $(elementId);
  if (!paginationElement) return;

  const nextBtn = paginationElement.firstElementChild?.firstElementChild;
  if (nextBtn) nextBtn.addEventListener('click', handleNextClick);

  const prevBtn = paginationElement.lastElementChild?.firstElementChild;
  if (prevBtn) prevBtn.addEventListener('click', handlePrevClick);
}

function handleNextClick(e) {
  e.preventDefault();
  console.log('next link clicked');
}

function handlePrevClick(e) {
  e.preventDefault();
  console.log('prev link clicked');
}

function handleFilterChange(filterName, filterValue) {
  // Update query parameters
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);

  history.pushState({}, '', url);

  // Fetch API
  // re-render product list
}

function renderPagination(totalCount, queryParams) {
  if (!totalCount || !queryParams) return;

  // calc total pages
  const page = queryParams.get('_page');
  const limit = queryParams.get('_limit');
  const totalPages = Math.ceil(totalCount / limit);

  const paginationElement = document.getElementById('productsPagination');
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

    renderProductList(data);
    initPagination({ elementId: '#productsPagination' });
    renderPagination(totalCount, queryParams);
  } catch (error) {
    console.log('Get all failed', error);
  }
})();
