<template>
    <title>{{ title }}</title>
</template>

<script>
export default {
  name: 'Title',
  data () {
    return {
      ROUTER_VERSION: process.env.ROUTER_VERSION
    }
  },
  computed: {
    title () {
      var route = this.$route.path
      var id = this.$route.params.id
      if (id && id !== '') {
        return id.toUpperCase()
      }
      if (this.ROUTER_VERSION) route = route.slice(this.ROUTER_VERSION.length)
      return `${this.$t(`title.${route.slice(1) === '' ? 'homepage' : route.slice(1).replace(/\//g, '_')}`)} - ${this.$t('brand')}`
    }
  }
}
</script>
