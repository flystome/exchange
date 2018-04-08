import Vue from 'vue'

Vue.filter('upper', function (value) {
  if (!value || value === '/' || value === 'undefined/undefined') return '--'
  return value.toUpperCase()
})
