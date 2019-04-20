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
            // {
            //     name: 'result_2010',
            //     checked: false,
            //     published: true,
            //     rows: {
            //         total: 150036
            //     }
            // }
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
        },
        addTable(state, table) {
            state.tables.push(table);
        }
    }
});

export default store;
