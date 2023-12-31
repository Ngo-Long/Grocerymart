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
  if (targetElement) targetElement.textContent = text;
}
