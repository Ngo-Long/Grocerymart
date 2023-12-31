import productApi from './api/productApi';
import {
  startCarousel,
  registerSearchInput,
  renderProductList,
  initPagination,
  renderPagination,
} from './utils/index';

async function handleFilterChange(filterName, filterValue) {
  try {
    // Update query parameters
    const url = new URL(window.location);
    const queryParams = url.searchParams;

    // Update
    queryParams.set(filterName, filterValue);

    // Reset page while searching
    if (filterName === 'title-like') queryParams.set('_page', 1);

    // Push
    history.pushState({}, '', url);

    // Fetch API
    // re-render product list
    const { data, totalCount } = await productApi.getAll(queryParams);

    renderProductList('#productList', data);
    renderPagination({
      elementId: '#productsPagination',
      defaultParams: queryParams,
      totalCount,
    });
  } catch (error) {
    console.log('Failed to fetch product list: ', error);
  }
}

// TODO: MAIN
// Asynchronous function that make HTTP requests use axiosClient
(async () => {
  try {
    const url = new URL(window.location);

    // Set default pagination (_limit, _page) on URL
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 8);

    history.pushState({}, '', url);

    // Render product list based URL param
    const queryParams = url.searchParams;
    const { data, totalCount } = await productApi.getAll(queryParams);

    // Attach click event for links in pagination
    initPagination({
      elementId: '#productsPagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    renderPagination({
      elementId: '#productsPagination',
      defaultParams: queryParams,
      totalCount,
    });

    // Render product list
    renderProductList('#productList', data);

    // Attach event search input product list
    registerSearchInput({
      elementId: '#inputSearchProduct',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title-like', value),
    });

    // Start carousel
    startCarousel({
      carouselId: '#carousel-id',
      carouselItem: '.carousel__item',
      selectorPrev: 'button[data-bs-slide="prev"]',
      selectorNext: 'button[data-bs-slide="next"]',
    });
  } catch (error) {
    console.log('Get all failed', error);
  }
})();
