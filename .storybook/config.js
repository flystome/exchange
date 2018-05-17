import { configure } from '@storybook/vue'
import Vue from 'vue/dist/vue.min.js';
import Vuex from 'vuex'; // Vue plugins
import MyButton from '../src/stories/MyButton.vue';

Vue.use(Vuex);
Vue.component('my-button', MyButton);

// automatically import all files ending in *.stories.js
const req = require.context('../src/stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module)
