import VueI18n from 'vue-i18n'
import Vue from 'vue'
import en from './en'
import zh_TW from './zh-TW'

Vue.use(VueI18n)
const messages = {
  'zh-TW': zh_TW,
  en: en.en
}

const i18n = new VueI18n({
  locale: 'en',
  messages
})

export default i18n
