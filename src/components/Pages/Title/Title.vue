<template>
    <title>{{`${$t(`title.${this.$route.path.slice(1) === '' ? 'member_center' : this.$route.path.slice(1).replace(/\//,'_') }`)} - ${$t('brand')}`}}</title>
</template>

<script>
export default {
  name: 'Title'
}
</script>
