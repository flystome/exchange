import VueI18n from 'vue-i18n'
import Vue from 'vue'
import en from './en'
import zh_TW from './zh-TW'
import zh_CN from './zh'
import Cookies from 'js-cookie'

Vue.use(VueI18n)
const messages = {
  'zh-TW': zh_TW,
  'zh_CN': zh_CN,
  en: en.en
}

const localeArray = Object.keys(messages)
export const CookieLocale = Cookies.get('locale') ? (localeArray.includes(Cookies.get('locale')) ? Cookies.get('locale') : 'en') : 'en'

const i18n = new VueI18n({
  locale: CookieLocale,
  messages
})

Cookies.set('locale', CookieLocale)

export default i18n
