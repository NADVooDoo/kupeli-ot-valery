import {Validator} from './validator';
import {callbacks} from './callback';
import {initPhoneInput} from './init-phone-input';

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

  _onFormSubmit(event, callback = null) {
    event.preventDefault(); // Предотвратить стандартную отправку формы

    if (isButtonDisabled) {
      console.log('Пожалуйста, подождите...');
      return;
    }

    if (this.validateForm(event.target)) {
      isButtonDisabled = true; // Блокировать кнопку
      // Отправка данных формы с помощью EmailJS
      emailjs.sendForm('service_2hoknrq', 'template_qnmamf8', event.target)
        .then((response) => {
          console.log('Заявка успешно отправлена!', response.status, response.text);
          // Вызов callback функции, если форма валидна и callback определен
          if (callback) {
            this._callbacks[callback].successCallback(event);
          }
          // Логика перестроения модального окна
          if (this._callbacks[callback].reset) {
            setTimeout(() => {
              this.reset(event.target);
              const modal = event.target.closest('.modal');
              if (modal) {
                // Скрыть все элементы формы, заголовок и текст
                const formElements = modal.querySelectorAll('.modal__form [data-validate-type], .modal__title, .modal__text, .modal__button');
                formElements.forEach(element => element.style.display = 'none');

                // Показать сообщение об успешной отправке
                const successMessage = modal.querySelector('.modal__success');
                successMessage.style.display = 'block';
              }
            }, this._callbacks[callback].resetTimeout ? this._callbacks[callback].resetTimeout : 500);
          }
        }, (error) => {
          console.log('Заявка застряла в интернете...', error);
          // Вызов callback функции ошибки, если форма не валидна и callback определен
          if (callback) {
            this._callbacks[callback].errorCallback(event);
          }
        })
        .finally(() => {
          setTimeout(() => {
            isButtonDisabled = false; // Разблокировать кнопку после 5 секунд
          }, 5000);
        });
    } else {
      // Если форма не валидна, вызов callback функции ошибки
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

// Функция для обновления скрытого поля при выборе комплекта
function updateSet(value) {
  document.getElementById('set-hidden').value = value;
}

// Добавьте эту функцию к каждому элементу списка, чтобы обновлять скрытое поле
document.querySelectorAll('.custom-select__item').forEach(item => {
  item.addEventListener('click', function() {
    updateSet(this.textContent);
    // Обновите также текст кнопки, чтобы отображать выбранный город
    document.querySelector('.custom-select__text').textContent = this.textContent;
  });
});
