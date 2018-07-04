<template>
  <ul class="pagination" :class="Object.assign({}, containerClass, {'paginate-disabled': disabled})" v-if="!noLiSurround">
    <li v-if="firstLastButton" :class="[pageClass, firstPageSelected() ? disabledClass : '']">
      <a :disabled="disabled" @click="selectFirstPage()" @keyup.enter="selectFirstPage()" :class="pageLinkClass">{{ firstButtonText }}</a>
    </li>

    <li v-if="!(firstPageSelected() && hidePrevNext)" :class="[prevClass, firstPageSelected() ? disabledClass : '']">
      <a :disabled="disabled" @click="prevPage()" @keyup.enter="prevPage()" :class="prevLinkClass" tabindex="0"><slot name="prevContent">{{ prevText }}</slot></a>
    </li>

    <li v-for="page in pages" :class="[pageClass, page.selected ? activeClass : '', page.disabled ? disabledClass : '', page.breakView ? breakViewClass: '']">
      <a :disabled="disabled" v-if="page.breakView" :class="[pageLinkClass, breakViewLinkClass]" tabindex="0"><slot name="breakViewContent">{{ breakViewText }}</slot></a>
      <a :disabled="disabled" v-else-if="page.disabled" :class="pageLinkClass" tabindex="0">{{ page.content }}</a>
      <a :disabled="disabled" v-else @click="handlePageSelected(page.index)" @keyup.enter="handlePageSelected(page.index)" :class="pageLinkClass" tabindex="0">{{ page.content }}</a>
    </li>

    <li v-if="!(lastPageSelected() && hidePrevNext)" :class="[nextClass, lastPageSelected() ? disabledClass : '']">
      <a :disabled="disabled" @click="nextPage()" @keyup.enter="nextPage()" :class="nextLinkClass" tabindex="0"><slot name="nextContent">{{ nextText }}</slot></a>
    </li>

    <li v-if="firstLastButton" :class="[pageClass, lastPageSelected() ? disabledClass : '']">
      <a :disabled="disabled" @click="selectLastPage()" @keyup.enter="selectLastPage()" :class="pageLinkClass">{{ lastButtonText }}</a>
    </li>
  </ul>

  <div class="pagination" :class="containerClass" v-else>
    <a :disabled="disabled" v-if="firstLastButton" @click="selectFirstPage()" @keyup.enter="selectFirstPage()" :class="[pageLinkClass, firstPageSelected() ? disabledClass : '']" tabindex="0">{{ firstButtonText }}</a>
    <a :disabled="disabled" v-if="!(firstPageSelected() && hidePrevNext)" @click="prevPage()" @keyup.enter="prevPage()" :class="[prevLinkClass, firstPageSelected() ? disabledClass : '']" tabindex="0"><slot name="prevContent">{{ prevText }}</slot></a>
    <template v-for="page in pages">
      <a :disabled="disabled" v-if="page.breakView" :class="[pageLinkClass, breakViewLinkClass, page.disabled ? disabledClass : '']" tabindex="0"><slot name="breakViewContent">{{ breakViewText }}</slot></a>
      <a :disabled="disabled" v-else-if="page.disabled" :class="[pageLinkClass, page.selected ? activeClass : '', disabledClass]" tabindex="0">{{ page.content }}</a>
      <a :disabled="disabled" v-else @click="handlePageSelected(page.index)" @keyup.enter="handlePageSelected(page.index)" :class="[pageLinkClass, page.selected ? activeClass : '']" tabindex="0">{{ page.content }}</a>
    </template>
    <a :disabled="disabled" v-if="!(lastPageSelected() && hidePrevNext)" @click="nextPage()" @keyup.enter="nextPage()" :class="[nextLinkClass, lastPageSelected() ? disabledClass : '']" tabindex="0"><slot name="nextContent">{{ nextText }}</slot></a>
    <a :disabled="disabled" v-if="firstLastButton" @click="selectLastPage()" @keyup.enter="selectLastPage()" :class="[pageLinkClass, lastPageSelected() ? disabledClass : '']" tabindex="0">{{ lastButtonText }}</a>
  </div>
</template>

<script>
export default {
  name: 'Paginate',
  props: {
    pageCount: {
      type: Number,
      required: true
    },
    initialPage: {
      type: Number,
      default: 0
    },
    forcePage: {
      type: Number
    },
    clickHandler: {
      type: Function,
      default: () => { }
    },
    pageRange: {
      type: Number,
      default: 3
    },
    marginPages: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prevText: {
      type: String,
      default: 'Prev'
    },
    nextText: {
      type: String,
      default: 'Next'
    },
    breakViewText: {
      type: String,
      default: '…'
    },
    containerClass: {
      type: Object
    },
    pageClass: {
      type: String
    },
    pageLinkClass: {
      type: String
    },
    prevClass: {
      type: String
    },
    prevLinkClass: {
      type: String
    },
    nextClass: {
      type: String
    },
    nextLinkClass: {
      type: String
    },
    breakViewClass: {
      type: String
    },
    breakViewLinkClass: {
      type: String
    },
    activeClass: {
      type: String,
      default: 'active'
    },
    disabledClass: {
      type: String,
      default: 'disabled'
    },
    noLiSurround: {
      type: Boolean,
      default: false
    },
    firstLastButton: {
      type: Boolean,
      default: false
    },
    firstButtonText: {
      type: String,
      default: 'First'
    },
    lastButtonText: {
      type: String,
      default: 'Last'
    },
    hidePrevNext: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: this.initialPage
    }
  },
  beforeUpdate() {
    if (this.forcePage === undefined) return
    if (this.forcePage !== this.selected) {
      this.selected = this.forcePage
    }
  },
  computed: {
    pages: function () {
      let items = {}
      if (this.pageCount <= this.pageRange) {
        for (let index = 0; index < this.pageCount; index++) {
          let page = {
            index: index,
            content: index + 1,
            selected: index === this.selected
          }
          items[index] = page
        }
      } else {
        const halfPageRange = Math.floor(this.pageRange / 2)

        let setPageItem = index => {
          let page = {
            index: index,
            content: index + 1,
            selected: index === this.selected
          }

          items[index] = page
        }

        let setBreakView = index => {
          let breakView = {
            disabled: true,
            breakView: true
          }

          items[index] = breakView
        }

        // 1st - loop thru low end of margin pages
        for (let i = 0; i < this.marginPages; i++) {
          setPageItem(i);
        }

        // 2nd - loop thru selected range
        let selectedRangeLow = 0;
        if (this.selected - halfPageRange > 0) {
          selectedRangeLow = this.selected - halfPageRange;
        }

        let selectedRangeHigh = selectedRangeLow + this.pageRange - 1;
        if (selectedRangeHigh >= this.pageCount) {
          selectedRangeHigh = this.pageCount - 1;
          selectedRangeLow = selectedRangeHigh - this.pageRange + 1;
        }

        for (let i = selectedRangeLow; i <= selectedRangeHigh && i <= this.pageCount - 1; i++) {
          setPageItem(i);
        }

        // Check if there is breakView in the left of selected range
        if (selectedRangeLow > this.marginPages) {
          setBreakView(selectedRangeLow - 1)
        }

        // Check if there is breakView in the right of selected range
        if (selectedRangeHigh + 1 < this.pageCount - this.marginPages) {
          setBreakView(selectedRangeHigh + 1)
        }

        // 3rd - loop thru high end of margin pages
        for (let i = this.pageCount - 1; i >= this.pageCount - this.marginPages; i--) {
          setPageItem(i);
        }
      }
      return items
    }
  },
  methods: {
    handlePageSelected(selected) {
      if (this.disabled === true) return
      if (this.selected === selected) return

      this.selected = selected

      this.clickHandler(this.selected + 1)
    },
    prevPage() {
      if (this.disabled === true) return
      if (this.selected <= 0) return

      this.selected--

      this.clickHandler(this.selected + 1)
    },
    nextPage() {
      if (this.disabled === true) return
      if (this.selected >= this.pageCount - 1) return

      this.selected++

      this.clickHandler(this.selected + 1)
    },
    firstPageSelected() {
      if (this.disabled === true) return
      return this.selected === 0
    },
    lastPageSelected() {
      if (this.disabled === true) return
      return (this.selected === this.pageCount - 1) || (this.pageCount === 0)
    },
    selectFirstPage() {
      if (this.disabled === true) return
      this.selected = 0

      this.clickHandler(this.selected)
    },
    selectLastPage() {
      if (this.disabled === true) return
      this.selected = this.pageCount - 1

      this.clickHandler(this.selected)
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  cursor: pointer;
}
.paginate-disabled{
  opacity: .65;
  a{
    cursor: not-allowed;
    &:focus,&:hover{
      background: white
    }
  }
  .active{
    a{
      background: #337ab7
    }
  }
}
</style>
