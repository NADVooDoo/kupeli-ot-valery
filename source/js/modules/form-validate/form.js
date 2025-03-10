import { Validator } from './validator';
import { callbacks } from './callback';
import { initPhoneInput } from './init-phone-input';
import { emailjs } from '../../vendor/email-min';

let isButtonDisabled = false;

export class Form {
  constructor() {
    this._validator = new Validator();
    this._initPhoneInput = initPhoneInput;
    this._callbacks = callbacks;
  }

  _resetSelect(select) {
    const nativeSelect = select.querySelector('select');
    const activeIndex = nativeSelect.options.selectedIndex;
    const selectedOption = nativeSelect.options[activeIndex];
    const buttonText = select.querySelector('.custom-select__text');
    const selectItems = select.querySelectorAll('.custom-select__item');
    buttonText.textContent = selectedOption.textContent;
    selectItems.forEach((item, index) => {
      if (index === activeIndex - 1) {
        item.setAttribute('aria-selected', 'true');
        return;
      }
      item.setAttribute('aria-selected', 'false');
    });
    if (!nativeSelect.value) {
      select.classList.remove('not-empty');
      select.classList.remove('is-valid');
    }
  }

  _resetSelects(form) {
    const selects = form.querySelectorAll('[data-select]');
    selects.forEach((select) => {
      this._resetSelect(select);
    });
  }

  reset(form) {
    form.reset();
    form.querySelectorAll('.is-invalid').forEach((item) => item.classList.remove('is-invalid'));
    form.querySelectorAll('.is-valid').forEach((item) => item.classList.remove('is-valid'));
    form.querySelectorAll('.input-message').forEach((item) => item.remove());
    setTimeout(() => {
      this._resetSelects(form);
    });
  }

  initPhoneInput(parent) {
    this._initPhoneInput(parent);
  }

  validateForm(form) {
    return this._validator.validateForm(form);
  }

  validateFormElement(item) {
    return this._validator.validateFormElement(item);
  }

  async _onFormSubmit(event, callback = null) {
    event.preventDefault(); // Предотвратить стандартную отправку формы

    if (isButtonDisabled) {
      console.log('Пожалуйста, подождите...');
      return;
    }

    // Удаляем предыдущее скрытое поле, если оно есть
    const existingHiddenInput = event.target.querySelector('input[type="hidden"][name="led"]');
    if (existingHiddenInput) {
      event.target.removeChild(existingHiddenInput);
    }

    // Изменяем значение чекбокса перед отправкой
    const ledCheckbox = event.target.querySelector('input[name="led"]');
    ledCheckbox.value = ledCheckbox.checked ? 'ДА' : 'НЕТ';

    // Добавляем скрытое поле, если чекбокс не выбран
    if (!ledCheckbox.checked) {
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'led';
      hiddenInput.value = 'НЕТ';
      event.target.appendChild(hiddenInput);
    }

    if (this.validateForm(event.target)) {
      isButtonDisabled = true; // Блокировать кнопку

      // Показываем сообщение об успешной отправке сразу
      const modal = event.target.closest('.modal');
      if (modal) {
        const formElements = modal.querySelectorAll('.modal__form [data-validate-type], .modal__title, .modal__text, .modal__button, .custom-toggle--led');
        formElements.forEach(element => element.style.display = 'none');

        const successMessage = modal.querySelector('.modal__success');
        successMessage.style.display = 'block';
      }

      try {
        // Отправка данных формы с помощью EmailJS с таймаутом
        const emailPromise = emailjs.sendForm('service_sxq6oq8', 'template_qnmamf8', event.target);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Таймаут запроса')), 10000); // Таймаут 10 секунд
        });

        const response = await Promise.race([emailPromise, timeoutPromise]);
        console.log('Заявка успешно отправлена!', response.status, response.text);

        if (callback) {
          this._callbacks[callback].successCallback(event);
        }
      } catch (error) {
        console.log('Ошибка при отправке формы:', error);
        if (callback) {
          this._callbacks[callback].errorCallback(event);
        }
      } finally {
        isButtonDisabled = false; // Разблокировать кнопку
      }
    } else {
      if (callback) {
        this._callbacks[callback].errorCallback(event);
      }
    }
  }

  _onFormInput(item) {
    this.validateFormElement(item);
  }

  _initValidate(parent) {
    const form = parent.querySelector('form');
    if (!form) {
      return;
    }

    const phoneParents = form.querySelectorAll('[data-validate-type="phone"]');
    phoneParents.forEach((item) => this._initPhoneInput(item));

    const callback = parent.dataset.callback;
    form.noValidate = true;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this._onFormSubmit(event, callback);
    });

    form.addEventListener('input', (event) => {
      this._onFormInput(event.target);
    });

    form.addEventListener('reset', (event) => {
      this.reset(event.target);
    });
  }

  init() {
    this._validateParent = document.querySelectorAll('[data-form-validate]');
    if (!this._validateParent.length) {
      return;
    }
    this._validateParent.forEach((parent) => this._initValidate(parent));
  }
}

function updateSet(value) {
  document.getElementById('set-hidden').value = value;
}

document.querySelectorAll('.custom-select__item').forEach(item => {
  item.addEventListener('click', function () {
    updateSet(this.textContent);
    document.querySelector('.custom-select__text').textContent = this.textContent;
  });
});
