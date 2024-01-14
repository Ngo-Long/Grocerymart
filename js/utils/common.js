export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export function setElementSourceBySelector(container, selector, source) {
  if (!container || !selector || !source) return;

  const targetElement = container.querySelector(selector);
  if (!targetElement) return;

  // add source to image
  targetElement.src = source;

  // set image default source on error
  targetElement.addEventListener('error', () => {
    console.log('Sự kiện lỗi đã được kích hoạt.');
    targetElement.src = 'https://placehold.co/600x400?text=Thumbnail';
  });
}

export function setElementTextContent(container, selector, text) {
  if (!container || !selector || !text) return;

  const targetElement = container.querySelector(selector);
  if (targetElement) targetElement.innerHTML = text;
}

export function isFavoriteProductElement(container, selector, isFavorite) {
  if (!container || typeof isFavorite !== 'boolean') return;

  const targetElement = container.querySelector(selector);
  if (!targetElement) return;

  // Add or remove 'like-btn--liked' class based on the updated isFavorite status
  targetElement.classList.toggle('like-btn--liked', isFavorite);

  targetElement.addEventListener('click', (e) => {
    e.preventDefault();
    targetElement.classList.toggle('like-btn--liked', (isFavorite = !isFavorite));
  });
}

export function renderthumbnailImages({ elementId, selectorClass, datasetAlbum, thumbnailImages }) {
  if (!elementId || !selectorClass || !datasetAlbum || !thumbnailImages) return;

  thumbnailImages.forEach((urlImg, index) => {
    // Add class to thumbnail
    const imgElement = document.createElement('img');
    imgElement.src = urlImg;
    imgElement.classList.add(selectorClass);
    imgElement.dataset.album = datasetAlbum;

    // Add 'active' class to the first image
    if (index === 0) imgElement.classList.add('active');

    // Append the thumbnail
    $(elementId).appendChild(imgElement);
  });
}
