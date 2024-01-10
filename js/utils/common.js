export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export function setElementSourceBySelector(container, selector, source) {
  if (!container) return;

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
  if (!container) return;

  const targetElement = container.querySelector(selector);
  if (targetElement) targetElement.innerHTML = text;
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
