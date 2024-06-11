import Swiper from '../vendor/swiper';
import {isMobileDevice} from '../utils/is-mobile-device';

const getGallerySlider = () => {
  if (document.querySelector('[data-gallery-slider]')) {
    return new Swiper('[data-gallery-slider]', {
      allowTouchMove: isMobileDevice(),
      slidesPerView: 'auto',
      navigation: {
        nextEl: '[data-gallery-next]',
        prevEl: '[data-gallery-prev]',
      },
    });
  }
  return null;
};

export {getGallerySlider};
