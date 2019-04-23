<template>
    <div id="connect">
        <el-card class="card">
            <div slot="header">
                <h3 class="title text-center"><i class="fas fa-database icon"></i> &nbsp;&nbsp;{{type === 'mssql'?
                    'SQL':'MongoDB'}}
                    Server Connection</h3>
            </div>
            <div>
                <div class="input" v-for="(input, key) in inputs" :key="key" :class="{error: input.error}">
                    <div class="label">
                        <label :for="key">{{key}}</label>
                    </div>
                    <el-input :id="key" :placeholder="input.placeholder" v-model="input.value" :type="input.type"/>
                </div>

                <!-- Buttons -->

                <div class="d-flex justify-content-center">
                    <el-button @click="connect"
                               :plain="!connected"
                               :type="connected?'success':''"
                               :loading="loading">
                        <span v-if="!loading && !connected" :key="'plug'">
                            <i class="fas fa-plug"></i>
                        </span>

                        <span v-if="connected" :key="''">
                            <i class="fas fa-check"></i>
                        </span>
                        &nbsp;&nbsp;Connect{{connected?'ed':loading?'ing':''}}
                    </el-button>

                    <el-button icon="el-icon-arrow-right" v-show="connected">Next</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {ipcRenderer} from 'electron';

    export default {
        props: {
            type: {
                type: String,
                required: true,
                default: 'mssql'
            }
        },
        data() {
            return {
                inputs: {},
                connected: false,
                loading: false
            };
        },

        methods: {
            connect() {

                // Make sure that fields are not empty

                if (!this.isDataValid()) {
                    // One or more fields are empty
                    return;
                }

                // Show loading spinner
                this.loading = true;

                // Register connection event
                // The main process will send reply through this channel after attempting to connect
                ipcRenderer.once('connect', (event, connected) => {
                    this.loading = false;

                    if (connected) {
                        // Database connection successful
                        this.connected = true;
                        this.$emit('connected');
                    }

                    // Database connection failed
                });

                // Tell the main process to connect

                const type = this.$props.type;
                let data = {};

                // Filter data
                for (let key in this.inputs) {
                    data[key] = this.inputs[key].value;
                }

                ipcRenderer.send('connect', {
                    type: type,
                    data: data
                });
            },

            isDataValid() {
                const inputs = this.inputs;
                let error = false;

                // Iterate over the inputs
                for (let key in inputs) {

                    // All the fields are required
                    if (!inputs[key].value) {
                        // No value provided
                        // Show error
                        inputs[key].error = error = true;
                        continue;
                    }

                    // Ok
                    inputs[key].error = false;
                }

                return !error;
            }
        },

        created() {

            const inputs = ['host', 'port', 'username', 'password'];
            // Mongodb's default port is 27017
            let port = 27017;

            // If database is mssql then port field is required
            // Mssql's default port is 1433

            if (this.$props.type === 'mssql') {
                inputs.push('database');
                port = 1433;
            }

            // Make data

            const data = {};

            inputs.forEach(input => data[input] = {
                value: input === 'port' ? port : '', // Set port by default
                placeholder: input === 'host' ? 'e.g. 192.168.0.2' : '',
                error: false,
                type: input === 'password' ? 'password' : 'text' // All the fields are text typed except password
            });

            this.$set(this.$data, 'inputs', data);



            /************ Comment out these lines before going to production *****************/

            // ipcRenderer.once('connect', (event, connected) => {
            //     this.loading = false;
            //
            //     if (connected) {
            //         // Database connection successful
            //         this.connected = true;
            //         this.$emit('connected');
            //     }
            //
            //     // Database connection failed
            // });
            //
            // if(this.$props.type === 'mssql') {
            //     ipcRenderer.send('connect', {
            //         type: 'mssql',
            //         data: {
            //             host: '103.200.37.130',
            //             port: '8082',
            //             username: 'osama',
            //             password: 'osama',
            //             database: 'WifaqResult'
            //         }
            //     });
            // } else {
            //     ipcRenderer.send('connect', {
            //         type: 'mongodb',
            //         data: {
            //             host: 'localhost',
            //             port: '27017',
            //             username: 'admin',
            //             password: 'k'
            //         }
            //     });
            // }

            /*********************************************************************/
        }
    }
</script>

<style lang="scss">
    #connect {

        .title {
            margin: 0;
            font-weight: 400;
        }

        .input {
            margin-bottom: 26px;
        }

        .label {
            padding-bottom: 10px;
            text-transform: capitalize;
        }

        .card {
            height: calc(100vh - 2px);
            transition: unset;
        }

        .error input {
            border-color: #dd6161;
        }
    }
</style>
