import productApi from './api/productApi';
import { startCarousel, setElementSourceBySelector, setElementTextContent } from './utils/index.js';

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

// Main
(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    };

    const data = await productApi.getAll(queryParams);
    renderProductList(data);
  } catch (error) {
    console.log('Get all failed', error);
  }

  startCarousel({
    carouselId: '#carousel-id',
    carouselItem: '.carousel__item',
    selectorPrev: 'button[data-bs-slide="prev"]',
    selectorNext: 'button[data-bs-slide="next"]',
  });
})();
