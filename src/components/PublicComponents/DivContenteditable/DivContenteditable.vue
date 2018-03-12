<template>
  <div class="edit-div"
  v-html="innerText" :contenteditable="canEdit"
  @focus="isLocked = true"
  @blur="isLocked = false"
  @input="changeText">
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
    }
  },
  data () {
    return {
      innerText: this.value,
      isLocked: false
    }
  },
  watch: {
    'value' () {
      if (!this.isLocked || !this.innerText) {
        this.innerText = this.value
      }
    }
  },
  methods: {
    changeText () {
      this.$emit('input', this.$el.innerHTML)
    }
  }
}
</script>
