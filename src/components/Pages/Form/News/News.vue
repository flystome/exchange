<template>
  <div class="btc-form-news">
    <header class="btc-news-radio">
      <div class="btc-fl">
        <strong style="color:black">{{$t('title.form_news')}}</strong>
      </div>
      <div class="btc-fr">
        <span :class="{'btc-form-disabled': clearList.length === xhrData.length}" @click="selectAll">
          <a :class="{'btc-radio': all}">
          </a>
          {{ $t('form.news.select_all') }}
        </span>
        <span :class="{'btc-form-disabled': clearList.length === 0}" @click="selectNone">
          <a :class="{'btc-radio': none}">
          </a>
          {{ $t('form.news.select_none') }}
        </span>
        <span :class="{'btc-form-disabled': clearList.length === 0}" class="btc-marginR0" @click="clearRecord">
          {{ $t('form.news.clear') }}
        </span>
      </div>
      <div style="clear:both">
      </div>
    </header>
    <div class="btc-news">
      <div class="btc-news-block" v-for="(d, index) in xhrData" @click="addClearList(d.id, index)" :key="d.id">
        <section class="btc-fl">
          <header>
            <strong>{{d.subject}}</strong>
            <span>{{ d.created_at }}</span>
          </header>
          <article>
            {{ d.message }}
          </article>
        </section>
        <div v-if="d.choice" class="btc-news-select">
          <img src="~Img/form-select.png">
        </div>
      </div>
    </div>
    <paginate
      ref="paginate"
      class="btc-fr"
      :disabled="disabled"
      v-if="pagination !== 0"
      :page-count="pagination"
      :page-range="3"
      :margin-pages="1"
      :click-handler="paging"
      :disabled-class='"disabled"'
      :prev-text="`${$t('form.previous')}`"
      :next-text="`${$t('form.next')}`"
      :page-class="'page-item'">
    </paginate>
    <div class="btc-no-record" v-if="pagination === 0 && firstLoad">
      <span>
        {{ $t('my_account.no_record') }}
      </span>
    </div>
  </div>
</template>

<script>
import { bus } from '@/common/js/bus'
import { mapMutations } from 'vuex'
export default {
  name: 'FormNews',
  created () {
    this.paging(1)
    bus.$on('Popbox-confirm', () => {
      this._post({
        url: '/conversations/clear.json',
        data: {
          choices: this.clearList
        }
      }, (d) => {
        if (d.data.success) {
          if (this.clearList.length === this.xhrData.length && this.$refs['paginate'].selected !== 0) {
            if (this.$refs['paginate'].selected + 1 === this.pagination) {
              this.paging(this.$refs['paginate'].selected)
              this.$refs['paginate'].selected = this.$refs['paginate'].selected - 1
              return
            }
          }
          this.paging(this.$refs['paginate'].selected + 1)
        }
      })
    })
  },
  data () {
    return {
      firstLoad: false,
      xhrData: [],
      pagination: 0,
      disabled: false,
      all: false,
      none: true,
      clearList: []
    }
  },
  methods: {
    paging (num) {
      if (this.disabled) return
      this.GetList(num)
    },
    addClearList (id, index) {
      this.xhrData[index].choice = !this.xhrData[index].choice
      this.clearList.includes(id) ? this.clearList.splice(this.clearList.indexOf(id), 1) : this.clearList.push(id)
      this.none = false
      this.all = false
      if (this.clearList.length === 0) {
        this.none = true
      }
      if (this.xhrData.length === this.clearList.length) {
        this.all = true
      }
    },
    GetList (num) {
      this.disabled = true
      this._get({
        url: `/conversations.json`,
        data: {
          page: num
        }
      }, (d) => {
        this.firstLoad = true
        this.clearList = []
        this.disabled = false
        d = d.data.success
        this.pagination = d.total_pages
        d.data.forEach((obj) => {
          obj.choice = false
        })
        this.xhrData = d.data
        this.all = false
        if (d.total_pages === 0) {
          this.none = false
        } else {
          this.none = true
        }
      })
    },
    selectAll () {
      if (this.pagination === 0) return
      this.all = true
      this.none = false
      this.clearList = []
      this.xhrData.forEach(obj => {
        obj.choice = true
        this.clearList.push(obj.id)
      })
    },
    selectNone () {
      if (this.pagination === 0) return
      this.all = false
      this.none = true
      this.clearList = []
      this.xhrData.forEach(obj => {
        obj.choice = false
      })
    },
    clearRecord () {
      if (this.clearList.length === 0) return
      this.PopupBoxDisplay({type: 'warn'})
      this.ChangePopupBox({
        message: this.$t('form.news.confirm'),
        confirm: true,
        buttonText: this.$t('hint.no'),
        buttondisplay: true
      })
    },
    ...mapMutations(['PopupBoxDisplay', 'ChangePopupBox'])
  }
}
</script>

<style lang="scss" scoped>
@import './News.scss';
</style>
