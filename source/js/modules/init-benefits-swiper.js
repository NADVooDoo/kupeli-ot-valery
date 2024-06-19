import Swiper from '../vendor/swiper';
import { isMobileDevice } from '../utils/is-mobile-device';

let swiper = null;
let resizeTimeout = null;

const getBenefitsSlider = () => {
  if (document.querySelector('[data-benefits-slider]')) {
    const isMobile = isMobileDevice();
    if (swiper) {
      swiper.destroy();
      swiper = null;
    }
    swiper = new Swiper('[data-benefits-slider]', {
      allowTouchMove: isMobile,
      direction: 'horizontal',
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          grid: {
            rows: 3,
            fill: 'row',
            spaceBetween: 0,
          },
        },
        1200: {
          slidesPerView: 'auto',
          grid: {
            rows: 2,
          },
        },
      },
      scrollbar: {
        el: '[data-benefits-scrollbar]',
      },
    });
    return swiper;
  }
  return null;
};

const initSlider = () => {
  swiper = getBenefitsSlider();
};

const resizeHandler = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    if (swiper) {
      swiper.destroy();
      swiper = getBenefitsSlider();
    }
  }, 100); // Задержка в миллисекундах
};

window.addEventListener('resize', resizeHandler);

export { initSlider, getBenefitsSlider };
