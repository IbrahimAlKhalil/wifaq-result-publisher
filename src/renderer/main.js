import Vue from 'vue';

import 'element-ui/lib/theme-chalk/index.css';
import './styles/index.scss';

import '@fortawesome/fontawesome-free/js/all';
import ElementUI from 'element-ui';
import App from './App.vue';
import store from './store';

Vue.use(ElementUI);

new Vue({
    components: {App},
    template: '<App/>',
    store
}).$mount('#app');
