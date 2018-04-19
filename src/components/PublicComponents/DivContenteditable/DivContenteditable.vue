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
      this.$emit('input', this.$el.children[0].innerHTML)
    }
  }
}
</script>
