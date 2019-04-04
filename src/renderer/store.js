import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        step: 1
    },
    mutations: {
        nextStep(state) {
            state.step++
        }
    }
});

export default store;
