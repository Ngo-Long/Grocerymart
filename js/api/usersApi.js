import axiosClient from './axiosClient';

const usersApi = {
  getAll(params) {
    const url = '/users';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/users';
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/users/${data.id}`;
    return axiosClient.patch(url);
  },

  remove(id) {
    const url = `/users/${id}`;
    return axiosClient.delete(url);
  },

  updateFormData(data) {
    const url = `/with-thumbnail/users/${data.get('id')}`;
    return axiosClient.patch(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default usersApi;
