import { $, setFieldValue, setElementsTextContent, setElementsSourceBySelector } from './common';
import * as yup from 'yup';

export function initPersonalForm({ formId, data, onSubmit }) {
  if (!formId || !data || !onSubmit) return;

  const form = $(formId);
  setFieldValue(form, '[name="fullName"]', data?.name);
  setFieldValue(form, '[name="email"]', data?.email);
  setFieldValue(form, '[name="phoneNumber"]', data?.phoneNumber);
  setFieldValue(form, '[name="company"]', data?.company);
  setFieldValue(form, '[name="imageSource"]', data?.imageBackground);
  setElementsSourceBySelector(document, '[data-id="avatar"]', data?.avatar); // hidden field
  setElementsSourceBySelector(document, '#profileImgBg', data?.imageBackground);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const formValues = getFormValues(form);
    console.log(formValues);

    // If valid trigger submit callback
    // Otherwise show validation errors
    if (!validatePersonalForm(form, formValues)) return;
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
    ['fullName', 'email', 'number'].forEach((name) => setFieldError(form, name, ''));

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

        // ignore if the field is already logged
        if (errorLog[name]) continue;

        // set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
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
    number: yup
      .number()
      .required('Please enter phone number')
      .typeError('Please enter a valid phone number'),
    company: yup.string(),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setElementsTextContent(element.parentElement, '.invalid-feedback', error);
  }
}
