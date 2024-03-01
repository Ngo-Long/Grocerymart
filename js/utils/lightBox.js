import { $, $$ } from './common';

// common
let imgList = [];
let currentIndex;

function showImageAtIndex(imageElement, imgList, currentIndex) {
  if (!imageElement || !imgList || currentIndex === undefined) return;

  // Delete 'active' all images
  imgList.forEach((img) => img.classList.remove('active'));

  // Update image modal when clicked or hovering
  imageElement.src = imgList[currentIndex]?.src;
  console.log(imgList[currentIndex]);

  // Display new image and add 'active'
  imgList[currentIndex]?.classList.add('active');
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
  if (!modalId || !imageId) return;

  const modalElement = $(modalId);
  const imageModal = modalElement?.querySelector(imageId);
  if (!imageModal) return;

  // check if this modal is already registered or not
  if (Boolean(modalElement.dataset.isRegistered)) return;

  // Event listeners for image modal
  document.addEventListener('click', (e) => {
    const { target } = e;
    if (!target.tagName === 'IMG' || !target.dataset.album) return;

    // Get all the images
    imgList = $$(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);
    showImageAtIndex(imageModal, imgList, currentIndex);

    if (target.dataset.album === 'thumbnail-image-product' && window.innerWidth >= 768) {
      toggleModalLightBox(modalElement);
    }
  });

  // attach event button
  $(prevSelector)?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImageAtIndex(imageModal, imgList, currentIndex);
  });

  $(nextSelector)?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    showImageAtIndex(imageModal, imgList, currentIndex);
  });

  // mark this modal is already registered
  modalElement.dataset.isRegistered = true;
}

export function showImageProductDetail({ imageId, thumbnailList, prevSelector, nextSelector }) {
  if (!imageId || !thumbnailList) return;

  // Event listeners for navigation buttons
  $(prevSelector)?.addEventListener('click', () => ($(thumbnailList).scrollLeft -= 120));
  $(nextSelector)?.addEventListener('click', () => ($(thumbnailList).scrollLeft += 120));

  // Event listeners for thumbnail images
  document.addEventListener('mouseover', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    if (target.dataset.album === 'thumbnail-image-show') return;

    // Get all the images
    imgList = $$(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);

    showImageAtIndex($(imageId), imgList, currentIndex);
  });
}
