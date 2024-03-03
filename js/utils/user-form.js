import { $, setFieldValue, setElementsTextContent, setElementsSourceBySelector } from './common';
import * as yup from 'yup';

export function initPersonalForm({ formId, data, onSubmit }) {
  if (!formId || !data || !onSubmit) return;

  const form = $(formId);
  setFieldValue(form, '[name="fullName"]', data?.fullName);
  setFieldValue(form, '[name="email"]', data?.email);
  setFieldValue(form, '[name="phoneNumber"]', data?.phoneNumber);
  setFieldValue(form, '[name="company"]', data?.company);
  setFieldValue(form, '[name="imageSource"]', data?.imageBackground);
  setElementsSourceBySelector(document, '[data-id="avatar"]', data?.avatar); // hidden field
  setElementsSourceBySelector(document, '#profileImgBg', data?.imageBackground);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formValues = getFormValues(form); // Get form values
    formValues.id = data.id; // Attach id to formValues

    // Otherwise show validation errors
    const isValid = await validatePersonalForm(form, formValues);
    if (!isValid) return;

    // If valid trigger, submit callback
    onSubmit?.(formValues);
  });
}

function getFormValues(form) {
  if (!form) return;
  const formValues = {};

  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

async function validatePersonalForm(form, formValues) {
  try {
    // reset previous validation
    ['fullName', 'email', 'phoneNumber'].forEach((name) => setFieldError(form, name, ''));

    // start new validation
    const schema = getPersonalSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    console.log(error.name);
    console.log(error.inner);

    const errorLog = {};

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;
        if (errorLog[name]) continue; // ignore if the field is already logged

        // set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  // add was-validated class to form element when submitting
  form.classList.add('was-validated');

  return form.checkValidity(); // return true or false
}

function getPersonalSchema() {
  return yup.object().shape({
    fullName: yup
      .string()
      .required('Please enter your name')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2,
      ),
    email: yup
      .string()
      .required()
      .email('Please email valid')
      .typeError('Please enter a valid number'),
    phoneNumber: yup
      .string()
      .required('Please enter phone number')
      .typeError('Please enter a valid phone number')
      .min(8, 'Phone number must be at least 8 characters'),
    company: yup.string(),
  });
}

function setFieldError(form, name, error) {
  if (!name || !error) return;
  const element = form?.querySelector(`[name="${name}"]`);

  element?.setCustomValidity(error);
  setElementsTextContent(element?.parentElement, '.form__invalid-feedback', error);
}
