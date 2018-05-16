import { configure } from '@storybook/vue'
import Vue from 'vue';
import Vuex from 'vuex'; // Vue plugins
import Mybutton from '../src/stories/Button.vue';

Vue.use(Vuex);
Vue.component('my-button', Mybutton);

// automatically import all files ending in *.stories.js
const req = require.context('../src/stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module)
