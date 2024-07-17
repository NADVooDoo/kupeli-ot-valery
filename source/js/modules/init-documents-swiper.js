import Swiper from '../vendor/swiper';
import {isMobileDevice} from '../utils/is-mobile-device';

const getDocumentsSlider = () => {
  if (document.querySelector('[data-documents-slider]')) {
    return new Swiper('[data-documents-slider]', {
      allowTouchMove: isMobileDevice(),
      slidesPerView: 'auto',
      navigation: {
        nextEl: '[data-documents-next]',
        prevEl: '[data-documents-prev]',
      },
    });
  }
  return null;
};

export {getDocumentsSlider};
