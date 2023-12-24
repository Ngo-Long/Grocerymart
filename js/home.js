// import { startCarousel } from './utils/index';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
function automaticCarousel(intervalTime, currentIndex, itemList) {
  if (!Number.isInteger(currentIndex) || currentIndex < 0 || !itemList) return;

  let timer = setInterval(() => {
    itemList[currentIndex].classList.remove('active');

    currentIndex = (currentIndex + 1) % itemList.length;
    itemList[currentIndex].classList.add('active');
  }, intervalTime);

  return timer;
}

function handleSlidePreviou(prevBtn, currentIndex, itemList, timer) {
  if (!prevBtn || !itemList) return;
  if (!Number.isInteger(currentIndex) || currentIndex < 0) return;

  // Move to the previou photo
  prevBtn.addEventListener('click', () => {
    itemList[currentIndex].classList.remove('active');

    currentIndex = (currentIndex - 1 + itemList.length) % itemList.length;
    itemList[currentIndex].classList.add('active');

    // Reset interval time to 4 seconds
    clearInterval(timer);
    timer = automaticCarousel(4000, currentIndex, itemList);
  });
}

function handleSlideNext(nextBtn, currentIndex, itemList, timer) {
  if (!nextBtn || !itemList) return;
  if (!Number.isInteger(currentIndex) || currentIndex < 0) return;

  // Move to the next photo
  nextBtn.addEventListener('click', () => {
    itemList[currentIndex].classList.remove('active');

    currentIndex = (currentIndex + 1) % itemList.length;
    itemList[currentIndex].classList.add('active');

    // Reset interval time to 4 seconds
    clearInterval(timer);
    timer = automaticCarousel(4000, currentIndex, itemList);
  });
}

export function startCarousel({ carouselId, carouselItem, selectorPrev, selectorNext }) {
  // Get carousel and all items
  const carousel = document.querySelector(carouselId);
  const itemList = carousel.querySelectorAll(carouselItem);

  // Get the controls buttons
  const prevBtn = carousel.querySelector(selectorPrev);
  const nextBtn = carousel.querySelector(selectorNext);

  // Set current index
  let currentIndex = [...itemList].findIndex((item) => item.classList.contains('active'));
  currentIndex = currentIndex !== -1 ? currentIndex : 0;

  // intervalTime = 4s
  let timer = automaticCarousel(4000, currentIndex, itemList);

  handleSlideNext(nextBtn, currentIndex, itemList, timer);
  handleSlidePreviou(prevBtn, currentIndex, itemList, timer);
}

// Main
(() => {
  startCarousel({
    carouselId: '#carousel-id',
    carouselItem: '.carousel__item',
    selectorPrev: 'button[data-bs-slide="prev"]',
    selectorNext: 'button[data-bs-slide="next"]',
  });
})();
