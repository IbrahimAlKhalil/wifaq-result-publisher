import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        connection: {
            step: 1,
            done: false
        },
        tables: [
            {
                name: 'result_2010',
                checked: false,
                published: true,
                rows: {
                    total: 150036
                }
            },
            {
                name: 'result_2011',
                checked: false,
                rows: {
                    total: 150036
                }
            },
            {
                name: 'result_2012',
                checked: false,
                rows: {
                    total: 150036
                }
            },
            {
                name: 'result_2013',
                checked: false,
                rows: {
                    total: 150036
                }
            },
            {
                name: 'result_2014',
                checked: false,
                published: true,
                rows: {
                    total: 150036
                }
            },
            {
                name: 'result_2015',
                checked: false,
                rows: {
                    total: 150036
                }
            },
            {
                name: 'result_2016',
                checked: false,
                rows: {
                    total: 150036
                }
            },
            {
                name: 'result_2017',
                checked: false,
                rows: {
                    total: 150036
                }
            },
            {
                name: 'result_2018',
                checked: false,
                rows: {
                    total: 150036
                }
            },
            {
                name: 'result_2019',
                checked: false,
                rows: {
                    total: 150036
                }
            },
        ],
        queue: []
    },
    mutations: {
        connectionNextStep(state) {
            state.connection.step++
        },
        connectionDone(state) {
            state.connection.done = true;
        },
        addToQueue(state, table) {
            state.queue.push(table);
        }
    }
});

export default store;
