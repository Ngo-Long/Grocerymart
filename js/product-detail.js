import productApi from './api/productApi';
import {
  $,
  registerLightBox,
  renderthumbnailImages,
  isFavoriteProductElement,
  setElementSourceBySelector,
  setElementTextContent,
  showImageProductDetail,
} from './utils/index';

function displayProductDetail(product) {
  if (!product) return;

  // Update the product detail element
  const { title, description, price, brand, score, imageUrl, thumbnailImages, isFavorite } =
    product;

  setElementTextContent(document, '#productHeading', title);
  setElementTextContent(document, '#productPrice', price);
  setElementTextContent(document, '#productScore', score);
  setElementTextContent(document, '#productBrand', brand);
  setElementTextContent(document, '#productContent', description);
  setElementSourceBySelector(document, '#productImage', imageUrl);
  isFavoriteProductElement(document, '[data-id="isFavoriteProduct"]', isFavorite);
  renderthumbnailImages({
    elementId: '#thumbnailImages',
    selectorClass: 'product__preview-thumbs-img',
    datasetAlbum: 'thumbnail-image-product',
    thumbnailImages,
  });

  // Update the modal
  setElementTextContent(document, '[data-id="productHeading"]', title);
  renderthumbnailImages({
    elementId: '#thumbnailImagesShow',
    selectorClass: 'product__preview-thumbs-img',
    datasetAlbum: 'thumbnail-image-show',
    thumbnailImages,
  });
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

    registerLightBox({
      modalId: '#lightBox',
      imageId: '#imageModal',
      prevSelector: 'button[data-bs-slide="prev"]',
      nextSelector: 'button[data-bs-slide="next"]',
    });

    showImageProductDetail({
      productId: '#productPreview',
      imageId: '#productImage',
      thumbnailList: '#thumbnailImages',
      prevSelector: 'button[data-slide-image="prev"]',
      nextSelector: 'button[data-slide-image="next"]',
    });
  } catch (error) {
    console.log(error);
  }
})();
