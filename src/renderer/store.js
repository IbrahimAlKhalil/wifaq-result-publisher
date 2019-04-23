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
            table.publishing = true;
        },
        addTable(state, table) {
            state.tables.push(table);
        },
        addRowsInserted(state, payload) {
            payload.table.rows.inserted += payload.inserted;
        },
        setTablePublished(state, table) {
            table.published = true;
            table.publishing = false;
        },
        restore(state) {
            state.queue = [];
        }
    }
});

export default store;
