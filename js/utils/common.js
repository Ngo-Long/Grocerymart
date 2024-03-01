export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export function setElementsSourceBySelector(container, selector, source) {
  const targetElements = container?.querySelectorAll(selector);
  if (!targetElements || targetElements.length === 0 || !source) return;

  targetElements.forEach((element) => {
    // Add source to image
    element.src = source;

    // Set default source on error
    element.addEventListener('error', () => {
      console.log('Sự kiện lỗi đã được kích hoạt.');
      element.src = 'https://placehold.co/600x400?text=Thumbnail';
    });
  });
}

export function setElementsTextContent(container, selector, text) {
  if (!container || !selector || !text) return;

  const targetElements = container?.querySelectorAll(selector);
  if (!targetElements || targetElements.length === 0) return;

  targetElements.forEach((element) => {
    element.innerHTML = text;
  });
}

export function isFavoriteProductElement(container, selector, isFavorite) {
  const targetElement = container?.querySelector(selector);
  if (!targetElement || typeof isFavorite !== 'boolean') return;

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

export function setFieldValue(form, selector, text) {
  if (!form || !selector || !text) return;

  const field = form?.querySelector(selector);
  if (field) field.value = text;
}
