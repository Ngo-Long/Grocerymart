import axiosClient from './api/axiosClient.js';
import { startCarousel } from './utils/index.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Main
(() => {
  startCarousel({
    carouselId: '#carousel-id',
    carouselItem: '.carousel__item',
    selectorPrev: 'button[data-bs-slide="prev"]',
    selectorNext: 'button[data-bs-slide="next"]',
  });
})();

async function main() {
  const response = await axiosClient.get('/products');
  console.log(response);
}
main();
