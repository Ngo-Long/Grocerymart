import { $, $$ } from './common';

export function registerLightBox() {
  const imageModal = $('#imageModal');
  const imageProduct = $('#productImage');
  const thumbnailImages = $('#thumbnailImages');
  if (!imageModal || !imageProduct || !thumbnailImages) return;

  let imgList = [];
  let currentIndex = 0;

  // Event listeners for navigation buttons
  const btnScrollPrev = $('button[data-slide-image="prev"]');
  btnScrollPrev?.addEventListener('click', () => (thumbnailImages.scrollLeft -= 120));

  const btnScrollNext = $('button[data-slide-image="next"]');
  btnScrollNext?.addEventListener('click', () => (thumbnailImages.scrollLeft += 120));

  // Event listeners for thumbnail images
  document.addEventListener('click', handleThumbnailClick);
  document.addEventListener('mouseover', handleThumbnailMouseover);

  function handleThumbnailClick(e) {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    if (window.innerWidth < 768) return;

    imgList = $$(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);
    imgList[currentIndex].classList.add('active');

    // attach event button
    const btnPrev = $('button[data-bs-slide="prev"]');
    btnPrev?.addEventListener('click', () => {
      currentIndex = (--currentIndex + imgList.length) % imgList.length;
      showImageAtIndex(currentIndex);
      return;
    });

    const btnNext = $('button[data-bs-slide="next"]');
    btnNext?.addEventListener('click', () => {
      currentIndex = ++currentIndex % imgList.length;
      showImageAtIndex(currentIndex);
      return;
    });

    showImageAtIndex(currentIndex);
    if (target.dataset.album !== 'thumbnail-image-show') toggleModalLightBox();
  }

  function handleThumbnailMouseover(e) {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    if (target.dataset.album === 'thumbnail-image-show') return;

    imgList = $$(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);

    // Update product image when hovering
    imageProduct.src = imgList[currentIndex].src;
    showImageAtIndex(currentIndex);
  }

  const showImageAtIndex = (currentIndex) => {
    // Delete 'active' all images
    imgList.forEach((img) => img.classList.remove('active'));

    // Display new image and add 'active'
    imageModal.src = imgList[currentIndex].src;
    imgList[currentIndex].classList.add('active');
  };
}

function toggleModalLightBox() {
  const modalElement = $('#lightBox');
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
