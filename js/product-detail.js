import productApi from './api/productApi';
import {
  $,
  registerLightBox,
  renderProductList,
  renderthumbnailImages,
  isFavoriteProductElement,
  setElementsSourceBySelector,
  setElementsTextContent,
  showImageProductDetail,
} from './utils/index';

function displayProductDetail(product) {
  if (!product) return;

  // Update the product detail element
  const { title, description, price, brand, score, imageUrl, thumbnailImages, isFavorite } =
    product;

  setElementsTextContent(document, '#productHeading', title);
  setElementsTextContent(document, '#productPrice', price);
  setElementsTextContent(document, '#productScore', score);
  setElementsTextContent(document, '#productBrand', brand);
  setElementsTextContent(document, '#productContent', description);
  setElementsSourceBySelector(document, '#productImage', imageUrl);
  isFavoriteProductElement(document, '[data-id="isFavoriteProduct"]', isFavorite);
  renderthumbnailImages({
    elementId: '#thumbnailImages',
    selectorClass: 'product__preview-thumbs-img',
    datasetAlbum: 'thumbnail-image-product',
    thumbnailImages,
  });

  // Update the modal
  setElementsTextContent(document, '[data-id="productHeading"]', title);
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
    // Get url search
    const searchParams = new URLSearchParams(window.location.search);

    // Get id from search params
    const productId = searchParams.get('data-id');
    if (!productId) return;

    // Get the product from id
    const productData = await productApi.getById(productId);
    if (!productData) return;

    // Get the product from brand
    const productBrand = productData.data.brand;
    const productDataBrand = await productApi.getByBrand(productBrand);
    if (!productBrand || !productDataBrand) return;

    // r-render
    displayProductDetail(productData.data);
    renderProductList('#productList', productDataBrand.data);

    registerLightBox({
      modalId: '#lightBox',
      imageId: '#imageModal',
      prevSelector: 'button[data-bs-slide="prev"]',
      nextSelector: 'button[data-bs-slide="next"]',
    });

    showImageProductDetail({
      imageId: '#productImage',
      thumbnailList: '#thumbnailImages',
      prevSelector: 'button[data-slide-image="prev"]',
      nextSelector: 'button[data-slide-image="next"]',
    });
  } catch (error) {
    console.log(error);
  }
})();
