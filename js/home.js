import productApi from './api/productApi';
import {
  startCarousel,
  registerSearchInput,
  renderProductList,
  initPagination,
  renderPagination,
  handleSelectChange,
} from './utils/index';

async function handleFilterChange(filterName, filterValue) {
  try {
    // Update query parameters
    const url = new URL(window.location);
    const queryParams = url.searchParams;
    queryParams.set(filterName, filterValue);

    let data, totalCount;

    // Fetch API, re-render product list
    if (filterName === 'brand' && filterValue) {
      queryParams.set('_page', 1); // Reset page
      ({ data, totalCount } = await productApi.getByBrand(filterValue));
    }

    if (filterName === 'title_like' && filterValue) {
      queryParams.set('_page', 1); // Reset page
      ({ data, totalCount } = await productApi.getByTitle(filterValue));
    }

    ({ data, totalCount } = await productApi.getAll(queryParams));

    // Push updated URL to history
    history.pushState({}, '', url);

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

    renderProductList('#productList', data);

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

    registerSearchInput({
      elementId: '#inputSearchProduct',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    handleSelectChange({
      elementId: '#filterSelect',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('brand', value),
    });

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
