import VueI18n from 'vue-i18n'
import Vue from 'vue'
import en from './en'
import zh from './zh-CN'

Vue.use(VueI18n)
const messages = {
  'zh-CN': zh,
  en: en.en
}

const i18n = new VueI18n({
  locale: 'en',
  messages
})

export default i18n
