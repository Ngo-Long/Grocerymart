import usersApi from './api/usersApi';
import {
  $,
  toast,
  initChangeImage,
  initPersonalForm,
  setElementsTextContent,
  setElementsSourceBySelector,
} from './utils/index';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // to use fromNow function

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handlePersonalFormSubmit(formValues) {
  if (!formValues) return;

  try {
    const formData = jsonToFormData(formValues);

    if (!formValues.id) return;
    await usersApi.updateFormData(formData);

    // show success message
    toast.success('Updated personal information successfully!');

    // redirect to personal profile page
    setTimeout(() => window.location.assign(`/profile.html?id=${savePersonal.id}`), 2000);
  } catch (error) {
    toast.error('Failed to save personal: ', error.message);
  }
}

function renderPersonalInfo(data) {
  if (!data) return;

  setElementsTextContent(
    document,
    '[data-id="registered"]',
    `Registered: ${dayjs(data.createdAt).format('DD-MM-YYYY')}`,
  );
  setElementsTextContent(document, '[data-id="userName"]', data.name);
  setElementsTextContent(document, '[data-id="email"]', data.email);
  setElementsTextContent(document, '[data-id="phoneNumber"]', data.phoneNumber);
  setElementsTextContent(document, '[data-id="address"]', data.address);
  setElementsSourceBySelector(document, '[data-id="avatar"]', data.imageAvatar);
  setElementsSourceBySelector(document, '[data-id="background"]', data.imageBackground);
}

// MAIN
(async () => {
  try {
    // Set default user id on URL
    const url = new URL(window.location);
    if (!url.searchParams.get('id')) url.searchParams.set('id', 1);
    history.pushState({}, '', url);

    // Get user id from URL
    const userId = url.searchParams.get('id');

    // Get data user
    const { data } = Boolean(userId)
      ? await usersApi.getById(userId)
      : {
          fullName: '',
          email: '',
          phoneNumber: '',
          company: '',
          imageAvatar: '',
          imageBackground: '',
        };

    renderPersonalInfo(data);
    initChangeImage({
      data,
      onSubmit: handlePersonalFormSubmit,
    });
    initPersonalForm({
      formId: '#personalForm',
      data,
      onSubmit: handlePersonalFormSubmit,
    });
  } catch (error) {
    console.log('Error get user', error);
  }
})();
