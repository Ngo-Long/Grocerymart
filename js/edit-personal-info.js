import usersApi from './api/usersApi';
import {
  setElementsTextContent,
  setElementsSourceBySelector,
  initPersonalForm,
} from './utils/index';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // to use fromNow function

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
        };

    console.log(data);

    renderPersonalInfo(data);
    initPersonalForm({
      formId: '#personalForm',
      data,
      onSubmit: handlePersonalFormSubmit,
    });
  } catch (error) {
    console.log('Error get user', error);
  }
})();

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
  setElementsSourceBySelector(document, '[data-id="avatar"]', data.avatar);
}

async function handlePersonalFormSubmit(formValues) {
  if (!formValues) return;

  console.log('Submit: ', formValues);

  try {
    // const formData = jsonToFormData(formValues);
    // if (formValues.id) await usersApi.update(formValues);
    if (!formValues.id) return;
    console.log('formValues: ', formValues.id);
    const savePersonal = await usersApi.update(formValues);
  } catch (error) {
    console.log('Failed to save personal: ', error);
  }
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}
