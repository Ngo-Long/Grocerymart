import { $, $$ } from './common';

export function registerLightBox() {
  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    let imgList = $$(`img[data-album="${target.dataset.album}"]`);
    if (!imgList.length) return;
  });
}
