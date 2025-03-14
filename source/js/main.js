import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';
import {Form} from './modules/form-validate/form';
import {CustomSelect} from './vendor/select/custom-select';
import {Burger} from './modules/burger/burger';
import {initEmailJS} from './vendor/init-email';
import {getGallerySlider} from './modules/init-gallery-swiper';
import {getBenefitsSlider} from './modules/init-benefits-swiper';
import {initSlider} from './modules/init-benefits-swiper';
import {initAccordions} from './modules/init-faq-tabs';
import {getMap} from './modules/init-contacts-map';
import {getDocumentsSlider} from './modules/init-documents-swiper';
import {Fancybox} from './vendor/fancybox'


// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------
  const burger = new Burger();
  burger.init();

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    getGallerySlider();
    initEmailJS();
    initModals();
    const form = new Form();
    window.form = form;
    form.init();
    const select = new CustomSelect();
    select.init();
    getBenefitsSlider();
    initSlider();
    initAccordions();
    getDocumentsSlider();
    getMap();
    Fancybox.bind("[data-fancybox]", {
    });
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используется matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
