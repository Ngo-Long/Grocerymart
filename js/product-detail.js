import productApi from './api/productApi';
import {
  $,
  registerLightBox,
  isFavoriteProductElement,
  setElementSourceBySelector,
  setElementTextContent,
} from './utils/index';

function renderthumbnailImages(thumbnailImages) {
  if (!thumbnailImages) return;

  const target = $('[data-id="thumbnailImages"]');
  if (!target) return;

  thumbnailImages.forEach((urlImg) => {
    const imgElement = document.createElement('img');
    imgElement.src = urlImg;
    imgElement.classList.add('product__preview-thumbs-img');
    imgElement.dataset.album = 'thumbnail-image-product';

    target.appendChild(imgElement);
  });
}

function displayProductDetail(product) {
  if (!product) return;

  // Update the product detail element
  const { title, description, price, brand, score, imageUrl, thumbnailImages } = product;
  setElementTextContent(document, '#productHeading', title);
  setElementTextContent(document, '#productPrice', price);
  setElementTextContent(document, '#productScore', score);
  setElementTextContent(document, '#productBrand', brand);
  setElementTextContent(document, '#productContent', description);
  setElementSourceBySelector(document, '#productImage', imageUrl);
  renderthumbnailImages(thumbnailImages);
}

// MAIN
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);

    // Get id from search params
    const productId = searchParams.get('id');
    if (!productId) return;

    // Get the product from id
    const productData = await productApi.getById(productId);
    if (!productData) return;

    displayProductDetail(productData.data);
    registerLightBox();
  } catch (error) {
    console.log(error);
  }
})();
