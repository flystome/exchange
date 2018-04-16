<template>
  <div class="menu-underline" :value='value'
>
    <nav>
      <ul ref="MenuList" :style="{'padding-bottom': UnderlineMargin}">
        <li v-for="(data, index) in MenuList" :key="data" @click="ChangeIndex(index)" :style="{'margin-left': MenuMargin}">{{ data }}</li>
        <span
        :style="{'background': UnderlineColor, 'height': UnderlineHeight, width: UnderlineWidth, left: UnderlineLeft}"
        >
        </span>
      </ul>
    </nav>
  </div>
</template>
<script>
export default {
  name: 'MenuUnderline',
  data () {
    return {
      index: 0,
      UnderlineLeft: 0,
      UnderlineWidth: 0,
    }
  },
  props: {
    MenuList: {
      type: Array
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
    value: {
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
    index () {
      this.changeOffset()
      this.$emit('input', this.index)
    }
  }
}
</script>

<style lang="scss" scoped>
ul{
  padding: 0;
  display: flex;
  overflow: hidden;
  position: relative;
  margin: 0;
  li{
    padding: 0;
    margin: 0;
    float: left;
    cursor: pointer;
  }
  li:nth-child(1){
    margin-left: 0!important;
  }
  span{
    width: 100%;
    display: block;
    position: absolute;
    bottom: 0;
    transition: 0.3s all ease;
  }
}
</style>
