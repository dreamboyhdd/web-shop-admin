import I18n from 'i18n-js';
import en from './en.json';
import vn from './vn.json';
I18n.defaultLocale = 'vn';
I18n.locale = 'vn';
I18n.fallbacks = true;
I18n.translations = { en, vn };
export default I18n;
