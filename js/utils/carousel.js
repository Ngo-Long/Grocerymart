export function startCarousel({ carouselId, carouselItem, selectorPrev, selectorNext }) {
  // Get carousel and all items
  const carousel = document.querySelector(carouselId);
  const itemList = carousel.querySelectorAll(carouselItem);
  if (!carousel || !itemList) return;

  // Get the controls buttons
  const prevBtn = carousel.querySelector(selectorPrev);
  const nextBtn = carousel.querySelector(selectorNext);
  if (!nextBtn || !itemList) return;

  // intervalTime = 4s
  let timer = automaticCarousel(4000, itemList);

  handleSlide(nextBtn, 1, itemList, timer);
  handleSlide(prevBtn, -1, itemList, timer);
}

function getCurrentIndex(itemList) {
  let currentIndex = Array.from(itemList).findIndex((item) => item.classList.contains('active'));
  if (!Number.isInteger(currentIndex) || currentIndex < 0) return;

  return currentIndex;
}

function automaticCarousel(intervalTime, itemList) {
  if (!Number.isInteger(intervalTime) || !itemList.length) return;

  let currentIndex = getCurrentIndex(itemList);

  let timer = setInterval(() => {
    toggleActive(currentIndex, itemList);

    currentIndex = (currentIndex + 1) % itemList.length;
    toggleActive(currentIndex, itemList);
  }, intervalTime);

  return timer;
}

function handleSlide(button, direction, itemList, timer) {
  if (!button || !itemList.length) return;

  // Move to the button next or butotn prev photo
  button.addEventListener('click', () => {
    let currentIndex = getCurrentIndex(itemList);

    toggleActive(currentIndex, itemList);

    let newIndex = (currentIndex + direction + itemList.length) % itemList.length;
    toggleActive(newIndex, itemList);

    // Reset interval time to 4 seconds
    clearInterval(timer);
    timer = automaticCarousel(4000, itemList);
  });
}

function toggleActive(index, itemList) {
  itemList.forEach((item) => item.classList.remove('active'));
  itemList[index].classList.add('active');
}
