import {
  $,
  setElementsSourceBySelector,
  setElementsTextContent,
  isFavoriteProductElement,
} from './common';

export function renderProductList(parentId, dataList) {
  if (!parentId || !Array.isArray(dataList)) return;

  // Clear current product list
  $(parentId).textContent = '';

  // get each data in dataList
  dataList.forEach((dataItem) => {
    const productItem = createProductItem(dataItem);

    // append productItem in productList
    $(parentId).appendChild(productItem);
  });
}

export function createProductItem(dataItem) {
  if (!dataItem) return;

  // Get in content product template
  const productItem = $('#productTemplate')?.content?.firstElementChild?.cloneNode(true);
  if (!productItem) return;

  // Update title, brand, price, score, imageUrl, description, thumbList
  setElementsTextContent(productItem, '[data-id="titleProduct"]', dataItem.title);
  setElementsTextContent(productItem, '[data-id="priceProduct"]', dataItem.price);
  setElementsTextContent(productItem, '[data-id="brandProduct"]', dataItem.brand);
  setElementsTextContent(productItem, '[data-id="scoreProduct"]', dataItem.score);
  setElementsTextContent(productItem, '[data-id="descProduct"]', dataItem.description);

  setElementsSourceBySelector(productItem, '[data-id="imageUrlProduct"]', dataItem.imageUrl);
  isFavoriteProductElement(productItem, '[data-id="isFavoriteProduct"]', dataItem.isFavorite);

  // Click on the product to redirect to the product detail page
  productItem?.firstElementChild?.addEventListener('click', (e) => {
    // Check if the clicked element is isFavoriteProduct
    const favoriteElement = productItem?.querySelector('[data-id="isFavoriteProduct"]');
    if (favoriteElement && favoriteElement.contains(e.target)) return;

    window.location.assign(`/product-detail.html?data-id=${dataItem.id}`);
  });

  return productItem;
}
