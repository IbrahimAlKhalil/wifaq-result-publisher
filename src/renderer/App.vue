<template>
    <div id="app" class="h-100" v-loading.fullscreen.lock="!initialized">
        <template v-if="initialized">
            <db-connect v-if="!connection.done"/>
            <div class="d-flex" v-else>
                <sidebar @published="publish"/>
                <div class="w-100">
                    <div>
                        <div class="process">
                            <el-card>
                                <h4 class="title text-center"><i class="fas fa-tasks"></i>&nbsp;&nbsp;Process</h4>
                            </el-card>
                            <div class="process-details text-center">
                                <process-info title="Started">10 Minutes ago</process-info>
                                <process-info title="ETA">1 Day 23 Minutes</process-info>
                                <process-info title="Tables">
                                    <el-progress type="circle"
                                                 :percentage="Math.round(100 * published / (queue.length || 1))"/>
                                    <h5 class="mt title">
                                        <span>{{running?published:0}}</span>
                                        <span>/</span>
                                        <span>{{queue.length}}</span>
                                    </h5>
                                </process-info>
                                <process-info title="Rows">
                                    <el-progress type="circle"
                                                 :percentage="Math.round(100 * rowsFinished / (rows || 1))"/>
                                    <h5 class="mt title">
                                        <span>{{rowsFinished}}</span>
                                        <span>/</span>
                                        <span>{{rows}}</span>
                                    </h5>
                                </process-info>
                            </div>
                            <process-info title="Whole process" class="mt">
                                <el-progress :percentage="percentage"/>
                                <h5 class="mt title">{{status}}</h5>
                            </process-info>
                            <transition name="slide-fade">
                                <process-info title="Currently processing Table" class="mt" v-if="current">
                                    <el-progress
                                            :percentage="Math.round(100 * current.rows.finished / (current.rows.total || 1))"/>
                                    <h5 class="mt title">
                                        <span>{{current.rows.finished}}</span>
                                        <span>/</span>
                                        <span>{{current.rows.total}}</span>
                                    </h5>
                                </process-info>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import Sidebar from './components/sidebar';
    import DbConnect from './components/db-connect-wrapper';
    import ProcessInfo from './components/process-info';
    import {mapState} from "vuex";

    import {ipcRenderer} from 'electron';

    export default {
        components: {DbConnect, Sidebar, ProcessInfo},
        data() {
            const state = this.$store.state;

            return {
                connection: state.connection,
                initialized: false,
                percentage: 0,
                started: 5446454565,
                eta: 9879877764,
                current: null,
                status: '',
                published: 0,
                running: false
            }
        },

        computed: {
            rows() {
                // Show zero rows if process is not running
                if (!this.running) {
                    return 0;
                }

                let count = 0;
                this.$store.state.queue.forEach(table => {
                    count += table.rows.total;
                });

                return count;
            },

            rowsFinished() {
                // Show zero rows if process is not running
                if (!this.running) {
                    return 0;
                }

                let count = 0;
                this.$store.state.queue.forEach(table => {
                    count += table.rows.finished;
                });

                return count;
            },
            ...mapState({
                queue: 'queue'
            })
        },

        methods: {
            publish() {
                this.running = true;
            }
        },

        created() {
            // The main process will reply through this channel after being asked to provide connection info
            ipcRenderer.once('connectionInfo', (event, connectionInfo) => {
                // The main process replied
                if (connectionInfo.mssql && connectionInfo.mongodb) {
                    // Connection is ok.
                    this.$store.commit('connectionDone');
                }

                // App is initialized
                this.initialized = true;
            });

            // Ask the main process to provide connection info
            ipcRenderer.send('connectionInfo');
        }
    }
</script>

<style lang="scss" scoped>
    @import "./styles/var";

    .process {
        padding: 10px;
        display: grid;
    }

    .title {
        margin: 0;
    }

    .process-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 8px;
        grid-row-gap: 8px;
        margin-top: 8px;
    }

    .mt {
        margin-top: .5rem;
    }
</style>
