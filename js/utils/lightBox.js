import { $, $$ } from './common';

function showImageAtIndex(imageElement, imgList, currentIndex) {
  // Delete 'active' all images
  imgList.forEach((img) => img.classList.remove('active'));

  // Update image modal when clicked or hovering
  imageElement.src = imgList[currentIndex].src;

  // Display new image and add 'active'
  imgList[currentIndex].classList.add('active');
}

function toggleModalLightBox(modalElement) {
  if (!modalElement) return;

  const isHidden = modalElement.classList.contains('hide');

  requestAnimationFrame(() => {
    modalElement.classList.toggle('hide', !isHidden);
    modalElement.classList.toggle('show', isHidden);
  });

  document.onclick = (e) => {
    if (e.target.closest('#modal-content')) return;
    const isHidden = $('#modal-content').classList.contains('hide');

    requestAnimationFrame(() => {
      modalElement.classList.toggle('hide', !isHidden);
      modalElement.classList.toggle('show', isHidden);
    });
  };
}

export function registerLightBox({ modalId, imageId, prevSelector, nextSelector }) {
  const modalElement = $(modalId);

  // check if this modal is already registered or not
  if (Boolean(modalElement.dataset.isRegistered)) return;

  const imageModal = modalElement.querySelector(imageId);
  if (!modalElement || !imageModal) return;

  // common
  let imgList = [];
  let currentIndex = 0;

  // attach event button
  $(prevSelector)?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImageAtIndex(imageModal, imgList, currentIndex);
  });

  $(nextSelector)?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    showImageAtIndex(imageModal, imgList, currentIndex);
  });

  // Event listeners for image modal
  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    if (window.innerWidth < 768) return;

    imgList = $$(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);

    showImageAtIndex(imageModal, imgList, currentIndex);
    if (target.dataset.album !== 'thumbnail-image-show') {
      toggleModalLightBox(modalElement);
    }
  });

  // mark this modal is already registered
  modalElement.dataset.isRegistered = true;
}

export function showImageProductDetail({
  productId,
  imageId,
  thumbnailList,
  prevSelector,
  nextSelector,
}) {
  if (!productId) return;

  const productPreview = $(productId);
  const imageProduct = productPreview?.querySelector(imageId);
  const thumbnailImages = productPreview?.querySelector(thumbnailList);

  // Common
  let imgList = [];
  let currentIndex = 0;

  // Event listeners for navigation buttons
  $(prevSelector)?.addEventListener('click', () => (thumbnailImages.scrollLeft -= 120));
  $(nextSelector)?.addEventListener('click', () => (thumbnailImages.scrollLeft += 120));

  // Event listeners for thumbnail images
  document.addEventListener('mouseover', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    if (target.dataset.album === 'thumbnail-image-show') return;

    imgList = $$(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);

    showImageAtIndex(imageProduct, imgList, currentIndex);
  });
}
