import { $, setFieldValue, setElementsTextContent } from './index';
import * as yup from 'yup';

function setFormValues(form, data) {
  if (!form || !data) return;

  setFieldValue(form, '[name="fullName"]', data?.fullName);
  setFieldValue(form, '[name="email"]', data?.email);
  setFieldValue(form, '[name="phoneNumber"]', data?.phoneNumber);
  setFieldValue(form, '[name="company"]', data?.company);
}

function getFormValues(form) {
  if (!form) return;

  const formValues = {};

  ['fullName', 'email', 'phoneNumber', 'company'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) formValues[name] = field.value;
  });

  ['imageBackground', 'imageAvatar'].forEach((name) => {
    const input = $(`[name="${name}"]`);
    if (input) formValues[name] = input.dataset.value;
  });

  return formValues;
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
      )
      .typeError('Please enter a valid name'),
    email: yup
      .string()
      .required('Please enter your email')
      .email('Please enter a valid email')
      .test('is-valid-email', 'Please enter a valid email', (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
      ),
    phoneNumber: yup
      .string()
      .required('Please enter your phone number')
      .test(
        'is-valid-phone-number',
        'Please enter a valid phone number',
        (value) => /^[0-9+\-\s]+$/.test(value) && value.length >= 8,
      ),
    company: yup.string(),
  });
}

async function validateFormField(form, formValues, name) {
  try {
    // clear previous error
    setFieldError(form, name, '');

    const schema = getPersonalSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFieldError(form, name, error.message);
  }

  // show validation error (if any)
  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

function initValidationOnChange(form) {
  ['fullName', 'email', 'phoneNumber'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    field?.addEventListener('input', (e) => {
      const newValue = e.target.value;
      validateFormField(form, { [name]: newValue }, name);
    });
  });
}

function showLoading(personalForm) {
  const submit = personalForm?.querySelector('[data-id="submit"]');
  if (submit) {
    submit.disabled = true;
    submit.textContent = 'Loading...';
  }
}

function hideLoading(personalForm) {
  const submit = personalForm?.querySelector('[data-id="submit"]');
  if (submit) {
    submit.disabled = false;
    submit.innerHTML = `<img style="width: 16px; margin-right: 4px; margin-top: -3px" 
    src="./assets/icons/save.png" alt=""/> Save`;
  }
}

async function validatePersonalForm(form, formValues) {
  if (!form || !formValues) return;

  try {
    // reset previous validation
    ['fullName', 'email', 'phoneNumber'].forEach((name) => setFieldError(form, name, ''));

    // start new validation
    const schema = getPersonalSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    console.log(error.name); // ValidationError
    console.log(error.errors); // array message error
    console.log(error.inner); // arr all

    const errorLog = {};

    if (error.name !== 'ValidationError' && !Array.isArray(error.inner)) return;
    for (const validationError of error.inner) {
      const name = validationError.path;

      // ignore if the field is already logged
      if (errorLog[name]) continue;

      // set field error and mark as logged
      setFieldError(form, name, validationError.message);
      errorLog[name] = true;
    }
  }

  // add was-validated class to form element when submitting
  const isValid = form.checkValidity();
  form.classList.add('was-validated');

  return isValid;
}

function setFieldError(form, name, error) {
  if (!form || !name || !error) return;

  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity('');
    setElementsTextContent(element.parentElement, '.form__invalid-feedback', error);
  }
}

export function initPersonalForm({ formId, data, onSubmit }) {
  if (!formId || !data || !onSubmit) return;

  const form = $(formId);
  setFormValues(form, data);
  initValidationOnChange(form);

  let isSubmitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent other submission
    if (isSubmitting) return;

    showLoading(form);
    isSubmitting = true;

    const formValues = getFormValues(form);
    formValues.id = data.id; // Attach id to formValues

    // Otherwise show validation errors
    let isValid = await validatePersonalForm(form, formValues);
    if (isValid) await onSubmit?.(formValues); // If valid trigger, submit callback

    // always hide loading no matter form is valid or not
    setTimeout(() => (hideLoading(form), (isSubmitting = false)), 1000);
  });
}
