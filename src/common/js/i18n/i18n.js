import VueI18n from 'vue-i18n'
import Vue from 'vue'
import en from './en'
import zh_TW from './zh-TW'
import Cookies from 'js-cookie'

Vue.use(VueI18n)
const messages = {
  'zh-TW': zh_TW,
  en: en.en
}

const localeArray = Object.keys(messages)
export const CookieLocale = Cookies.get('locale') ? (localeArray.includes(Cookies.get('locale')) ? Cookies.get('locale') : 'en') : 'en'

const i18n = new VueI18n({
  locale: 'en',
  messages
})

export default i18n
