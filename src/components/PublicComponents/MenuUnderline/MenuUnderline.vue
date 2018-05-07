<template>
  <div class="menu-underline btc-link"
>
    <nav>
      <ul ref="MenuList">
        <li  v-for="(data, DataIndex) in MenuList" :key="data" @click="ChangeIndex(DataIndex)" :style="{'margin-left': MenuMargin, 'padding-bottom': UnderlineMargin}">{{ data }}</li>
        <span
        :style="{'background': UnderlineColor, 'height': UnderlineHeight, width: UnderlineWidth, left: UnderlineLeft}"
        >
        </span>
      </ul>
    </nav>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'MenuUnderline',
  data () {
    return {
      index: 0,
      UnderlineLeft: 0,
      UnderlineWidth: 0
    }
  },
  props: {
    MenuList: {
      type: Array
    },
    route: {
      type: String
    },
    MenuMargin: {
      type: String,
      default: '20px'
    },
    UnderlineMargin: {
      type: String,
      default: '20px'
    },
    UnderlineColor: {
      type: String,
      default: '#4382f7'
    },
    UnderlineHeight: {
      type: String,
      default: '4px'
    },
    MenuIndex: {
      type: Number
    }
  },
  mounted () {
    this.changeOffset()
  },
  methods: {
    ChangeIndex (index) {
      this.index = index
    },
    changeOffset () {
      this.UnderlineWidth = this.$refs['MenuList'].querySelectorAll('li')[this.index].offsetWidth + 'px'
      this.UnderlineLeft = this.$refs['MenuList'].querySelectorAll('li')[this.index].offsetLeft + 'px'
    }
  },
  watch: {
    MenuIndex () {
      this.index = this.MenuIndex
    },
    index () {
      this.changeOffset()
      this.$emit('input', this.index)
    },
    async language () {
      if (this.route !== this.$route.name) return
      await this.$nextTick()
      this.changeOffset()
    },
    async $route (to) {
      if (this.route !== to.name) return
      await this.$nextTick()
      this.changeOffset()
    }
  },
  computed: {
    ...mapState(['language'])
  }
}
</script>

<style lang="scss" scoped>
@import './MenuUnderline.scss';
</style>
