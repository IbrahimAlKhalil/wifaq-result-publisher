<template>
    <div id="connect">
        <el-card class="card">
            <div slot="header">
                <h3 class="title"><i class="fas fa-database"></i> &nbsp;&nbsp;{{type === 'mssql'? 'SQL':'MongoDB'}}
                    Server Connection</h3>
            </div>
            <div>
                <!-- Host -->
                <!--#dd6161-->
                <div class="input">
                    <div class="label">
                        <label for="host">Host</label>
                    </div>
                    <el-input id="host" placeholder="e.g. 192.168.0.2" v-model="host"/>
                </div>

                <!-- Port -->

                <div class="input">
                    <div class="label">
                        <label for="port">Port</label>
                    </div>
                    <el-input id="port" v-model="port"/>
                </div>

                <!-- Username -->

                <div class="input">
                    <div class="label">
                        <label for="username">Username</label>
                    </div>
                    <el-input id="username" v-model="username"></el-input>
                </div>

                <!-- Username -->

                <div class="input">
                    <div class="label">
                        <label for="password">Password</label>
                    </div>
                    <el-input id="password" v-model="password"></el-input>
                </div>


                <!-- Database -->

                <div class="input" v-if="type==='mssql'">
                    <div class="label">
                        <label for="database">Database</label>
                    </div>
                    <el-input id="database" v-model="database"></el-input>
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
    export default {
        props: {
            type: {
                type: String,
                required: true,
                default: 'mssql'
            }
        },
        data() {
            const type = this.$props.type;

            return {
                host: '',
                port: type === 'mssql' ? 36 : 27017,
                username: '',
                password: '',
                database: '',
                connected: false,
                loading: false
            };
        },

        methods: {
            connect() {
                this.loading = true;

                setTimeout(() => {
                    this.loading = false;
                    this.connected = true;
                    this.$emit('connected');
                }, 3000);
            }
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
        }

        .card {
            height: calc(100vh - 2px);
            transition: unset;
        }
    }
</style>
