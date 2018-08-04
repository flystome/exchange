<template>
  <div class="language" @mouseenter='show=true' @mouseleave='show=false'>
    <a class="dropdown-toggle checkout" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
      <span>{{getLanguage.name}}</span><span class="caret"></span>
    </a>
    <ul class="dropdown text-center" v-show='show'>
      <li v-for="locale in locale" :key="locale.language">
        <a @click="changeLang(locale.language)">{{locale.name}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'language',
  data () {
    return {
      show: false,
      locale: [{
        language: 'zh-TW',
        name: '正體中文'
      },
      {
        language: 'zh-CN',
        name: '简体中文'
      },
      {
        language: 'en',
        name: 'English'
      }]
    }
  },
  methods: {
    changeLang (str) {
      this.ChangeLanguage(str)
    },
    ...mapActions(['ChangeLanguage'])
  },
  computed: {
    getLanguage () {
      var lang = ''
      this.locale.map((d, index) => {
        if (d.language === this.language) {
          lang = d
        }
      })
      return lang
    },
    ...mapState(['language'])
  }
}
</script>

<style lang="scss" scoped>
  @import './language.scss';
</style>
