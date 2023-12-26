import productApi from './api/productApi';
import { startCarousel } from './utils/index.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function createProductItem(dataItem) {
  if (!dataItem) return;

  // Get id product template
  const productTemplate = $('#productTemplate');
  if (!productTemplate) return;

  // Get in content product template
  const productItem = productTemplate.content.firstElementChild.cloneNode(true);
  if (!productItem) return;

  // Update title, brand, price, score, image, thumbList
  const titleProduct = productItem.querySelector('[data-id="titleProduct"]');
  if (titleProduct) titleProduct.textContent = dataItem.title;

  const priceProduct = productItem.querySelector('[data-id="priceProduct"]');
  if (priceProduct) priceProduct.textContent = dataItem.price;

  const brandProduct = productItem.querySelector('[data-id="brandProduct"]');
  if (brandProduct) brandProduct.textContent = dataItem.brand;

  const scoreProduct = productItem.querySelector('[data-id="scoreProduct"]');
  if (scoreProduct) scoreProduct.textContent = dataItem.score;

  const imageUrlProduct = productItem.querySelector('[data-id="imageUrlProduct"]');
  if (imageUrlProduct) imageUrlProduct.textContent = dataItem.imageUrl;

  const isFavoriteProduct = productItem.querySelector('[data-id="isFavoriteProduct"]');
  if (isFavoriteProduct) isFavoriteProduct.textContent = dataItem.isFavorite;

  const descProduct = productItem.querySelector('[data-id="descProduct"]');
  if (descProduct) descProduct.textContent = dataItem.description;

  return productItem;
}

function renderProductList(dataList) {
  if (!Array.isArray(dataList) || !dataList.length) return;

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
