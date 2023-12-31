import { $, setElementSourceBySelector, setElementTextContent } from './common';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // to use fromNow function

export function renderProductList(elementId, dataList) {
  if (!elementId || !Array.isArray(dataList)) return;

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

export function createProductItem(dataItem) {
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

  const elementLink = productItem.firstElementChild;
  if (!elementLink) return;

  elementLink.addEventListener('click', () => {
    // /product-detail.html?_page=1&_limit=8&id=1
    window.location.assign(`/product-detail.html?id=${dataItem.id}`);
  });

  return productItem;
}

export function isFavoriteProductElement(container, selector, isFavorite) {
  if (!container || typeof isFavorite !== 'boolean') return;

  const targetElement = container.querySelector(selector);
  if (!targetElement) return;

  // Add or remove classes depending on the value of isFavorite
  return isFavorite === true
    ? targetElement.classList.add('like-btn--liked')
    : targetElement.classList.remove('like-btn--liked');
}
