<template>
  <div>
    <div class="edit-div"
    v-html="innerText" :contenteditable="canEdit"
    :value='value'
    @focus="isLocked = true"
    @blur="isLocked = false"
    @input="changeText">
    </div>
    <slot v-if="!value" name='placeholder'></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'DivContenteditable',
  props: {
    value: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String
    }
  },
  data () {
    return {
      innerText: this.value,
      isLocked: true,
      edit: true
    }
  },
  methods: {
    changeText () {
      this.edit = true
      this.$emit('input', this.$el.children[0].innerHTML)
      this.$nextTick(() => {
        this.edit = false
      })
    },
    changeInnerText () {
      this.innerText = Math.random()
      this.$nextTick(() => {
        this.innerText = this.value
      })
    }
  },
  watch: {
    'value' () {
      if (this.edit && !this.innerText) return
      this.changeInnerText()
    }
  }
}
</script>

<style lang="scss" scoped>
 .edit-div{
   &[contenteditable=true]{
      -webkit-user-modify: read-write-plaintext-only;
   }
 }
</style>

