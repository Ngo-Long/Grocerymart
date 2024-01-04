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

    // Reset page
    if (['title_like', 'brand_like', 'price_range'].includes(filterName)) {
      queryParams.set('_page', 1);
    }

    // Update the URL in the history
    history.pushState({}, '', url);

    // Fetch API - Push updated URL to history
    const { data, totalCount } = await productApi.getAll(queryParams);

    // Sort data by price
    // filterName === 'price_range' && filterValue
    if (filterValue === 'asc') data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (filterValue === 'desc') data.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

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

    // r-render
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
      elementsId: ['#inputSearchProduct', '#btnSearchProduct'],
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    handleSelectChange({
      elementsId: ['#selectedBrand', '#taggedBrand'],
      defaultParams: queryParams,
      filterType: 'brand_like',
      onChange: (value) => handleFilterChange('brand_like', value),
    });

    handleSelectChange({
      elementsId: ['#selectedPrice', '#taggedPrice'],
      defaultParams: queryParams,
      filterType: 'price_range',
      onChange: (value) => handleFilterChange('price_range', value),
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
