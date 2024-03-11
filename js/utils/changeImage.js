import { $, toast, randomNumber, setElementsSourceBySelector, setFieldValue } from './index';
import * as yup from 'yup';

export function initChangeImage({ data, onSubmit }) {
  if (!data || !onSubmit) return;

  // Set default
  setDataValue('[name="imageAvatar"]', data?.imageAvatar);
  setDataValue('[name="imageBackground"]', data?.imageBackground);

  // Upload image background
  setupImageRandom({
    inputId: '#imageSourcePicsumBg',
    imgId: '[data-id="background"]',
    data,
    onSubmit,
  });
  setupImageUpload({
    inputId: '#imageSourceUploadBg',
    imgId: '[data-id="background"]',
    data,
    onSubmit,
  });

  // Upload image avatar
  setupImageUpload({
    inputId: '#imageSourceUploadAvatar',
    imgId: '[data-id="avatar"]',
    data,
    onSubmit,
  });
}

function setDataValue(name, src) {
  if (!name || !src) return;

  const input = document.querySelector(name);
  if (input) input.dataset.value = src;
}

function setupImageRandom({ inputId, imgId, data, onSubmit }) {
  if (!inputId || !imgId || !data) return;

  let isClicked = true;

  $(inputId)?.addEventListener('click', async () => {
    if (!isClicked) return;

    toast.info('Please wait 3 seconds to load!');
    isClicked = false;

    // Random image
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;

    // Set value input and src image
    setFieldValue(document, inputId, imageUrl);
    setElementsSourceBySelector(document, imgId, imageUrl);

    // Update data with image URL
    const newData = { ...data, imageBackground: imageUrl };
    await onSubmit?.(newData);

    setTimeout(() => (isClicked = true), 2000);
  });
}

function setupImageUpload({ inputId, imgId, data, onSubmit }) {
  if (!inputId || !imgId || !data) return;

  $(inputId)?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    // Check image size
    let isValid = await validateImageSize(file, inputId);
    if (!isValid) return;

    setElementsSourceBySelector(document, imgId, imageUrl);

    // Update data with image URL based on input name
    const newData = { ...data };
    $(inputId)?.id === 'imageSourcePicsumBg'
      ? (newData.imageBackground = imageUrl)
      : (newData.imageAvatar = imageUrl);

    await onSubmit?.(newData);
    URL.revokeObjectURL(imageUrl);
  });
}

async function validateImageSize(file, inputId) {
  if (!file || !inputId) return false;

  try {
    const schema = yup.object().shape({
      [inputId]: yup
        .mixed()
        .test('fileSize', 'File size is too large. Max size is 3MB', (value) => {
          return value ? value.size <= 3 * 1024 * 1024 : true;
        }),
    });

    await schema.validate({ [inputId]: file }, { abortEarly: false });
    return true;
  } catch (error) {
    return false;
  }
}
