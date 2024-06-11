import {emailjs} from './email-min';

const initEmailJS = () => {
  emailjs.init({
  publicKey: 'iYEZTsn65E9xeZ_41',
  });
  };

export {initEmailJS};
