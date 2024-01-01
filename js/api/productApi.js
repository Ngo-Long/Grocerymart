import axiosClient from './axiosClient';

const productApi = {
  getAll(params) {
    const url = '/products';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },

  getByTitle(value) {
    const url = `/products?title_like="${value}"`;
    return axiosClient.get(url);
  },

  getByBrand(value) {
    const url = `/products?brand="${value}"`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/products';
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/products/${data.id}`;
    return axiosClient.patch(url);
  },

  remove(id) {
    const url = `/product/${id}`;
    return axiosClient.delete(url);
  },

  addFormData() {},

  updateFormData() {},
};

export default productApi;
