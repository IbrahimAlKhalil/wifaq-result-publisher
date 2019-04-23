<template>
    <div>
        <connect type="mssql" v-if="connection.step === 1" @connected="next" key="step1"/>
        <connect type="mongodb" v-else-if="connection.step === 2" @connected="next" key="step2"/>
    </div>
</template>

<script>
    import Connect from './db-connect';
    import {mapState} from 'vuex';
    import {ipcRenderer} from 'electron';

    export default {
        computed: mapState(['connection']),

        methods: {
            next() {
                const store = this.$store;

                if (store.state.connection.step === 2) {
                    // Database connections are set

                    // Ask the main process to to close this window and create another
                    ipcRenderer.send('createNewWindow');

                    return;
                }

                store.commit('connectionNextStep');
            }
        },

        components: {Connect}
    }
</script>
