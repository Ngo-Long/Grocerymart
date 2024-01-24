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

  getByBrand(brand) {
    const url = '/products';
    return axiosClient.get(url, { params: { brand } });
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
    const url = `/products/${id}`;
    return axiosClient.delete(url);
  },

  addFormData() {},

  updateFormData() {},
};

export default productApi;
