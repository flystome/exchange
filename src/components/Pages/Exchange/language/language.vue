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
import { mapState, mapMutations } from 'vuex'
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
        language: 'en',
        name: 'English'
      }]
    }
  },
  methods: {
    changeLang (str) {
      if (this.$i18n.locale === str) return
      this.ChangeLanguage(str)
      this.$i18n.locale = str
      this._post({// 同步3000端口
        url: '/settings/language.json',
        headers: {
          'DataType': 'application/json;charset=utf-8'
        },
        data: {
          'content_language': str
        }
      })
    },
    ...mapMutations(['ChangeLanguage'])
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
<style lang="scss">
  @import './language.scss'
</style>
