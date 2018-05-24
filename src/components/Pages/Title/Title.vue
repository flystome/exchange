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
      if (this.$route.name === 'HomePage' || this.$route.name === 'home') return this.$t('slogen')
      var route = this.$route.path
      if (route.lastIndexOf('/') === route.length - 1) route = route.slice(0, route.length - 1)
      if (this.ROUTER_VERSION) route = route.slice(this.ROUTER_VERSION.length)
      // return `${this.$t(`title.${route.slice(1) === '' ? 'homepage' : route.slice(1).replace(/\//g, '_')}`)} - ${this.$t('brand')}`
      return `${this.$t(`title.${route.slice(1) === '' ? 'homepage' : route.slice(1).replace(/\//g, '_')}`)} - ${this.$t('brand')}`
    }
  }
}
</script>
