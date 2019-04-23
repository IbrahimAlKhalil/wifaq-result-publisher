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
                                <process-info title="Started">{{started.string}}</process-info>
                                <process-info title="Will be finished">{{etaString}}</process-info>
                                <process-info title="Tables">
                                    <el-progress type="circle"
                                                 :percentage="finished?0:Math.round(100 * tablesPublished / (queue.length || 1))"
                                                 :status="statusClass"/>
                                    <h5 class="mt title">
                                        <span>{{running?tablesPublished:0}}</span>
                                        <span>/</span>
                                        <span>{{queue.length}}</span>
                                    </h5>
                                </process-info>
                                <process-info title="Rows">
                                    <el-progress type="circle"
                                                 :percentage="Math.round(100 * rowsInserted / (rows || 1))"
                                                 :status="statusClass"/>
                                    <h5 class="mt title">
                                        <span>{{rowsInserted}}</span>
                                        <span>/</span>
                                        <span>{{rows}}</span>
                                    </h5>
                                </process-info>
                            </div>
                            <process-info title="Whole process" class="mt">
                                <el-progress :percentage="wholeProcess"/>
                            </process-info>
                            <transition name="slide-fade">
                                <process-info v-if="current" :title="current.title" class="mt">
                                    <template v-if="current.type === 'insertion'">
                                        <el-progress
                                                :percentage="Math.round(100 * current.table.rows.inserted / (current.table.rows.total || 1))"/>
                                        <h5 class="mt title">
                                            <span>{{current.table.rows.inserted}}</span>
                                            <span>/</span>
                                            <span>{{current.table.rows.total}}</span>
                                        </h5>
                                    </template>
                                    <p v-else>Indexing...</p>
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
    import moment from 'moment';

    export default {
        components: {DbConnect, Sidebar, ProcessInfo},
        data() {
            const state = this.$store.state;

            return {
                connection: state.connection,
                initialized: false,
                current: null,
                running: false,
                finished: false,
                started: {
                    string: 'n/a',
                    timestamp: null
                },
                eta: null
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

            rowsInserted() {
                // Show zero rows if process is not running
                if (!this.running) {
                    return 0;
                }

                let count = 0;
                this.queue.forEach(table => {
                    count += table.rows.inserted;
                });

                return count;
            },
            tablesPublished() {
                return this.queue.filter(table => table.published).length;
            },
            wholeProcess() {
                if (this.finished) {
                    return 0;
                }

                return Math.round(96 * this.rowsInserted / (this.rows || 1));
            },
            statusClass() {
                return (this.rowsInserted && this.rows) && this.rowsInserted === this.rows ? 'success' : undefined;
            },
            etaString() {
                if (!this.eta) {
                    return 'n/a';
                }

                return moment(this.eta).fromNow();
            },
            ...mapState({
                queue: 'queue',
                tables: 'tables'
            })
        },

        methods: {
            publish() {
                // Set process running
                this.running = true;

                // Make sure timestamp is null
                if (this.started.timestamp === null) {
                    this.started.timestamp = Date.now();
                    const interval = setInterval(() => {
                        // Don't update eta and started after process has ended
                        if (!this.running) {
                            clearInterval(interval);
                            this.started = {
                                string: 'n/a',
                                timestamp: null
                            };

                            return;
                        }

                        this.started.string = moment(this.started.timestamp).fromNow();
                    }, 1000);
                }

                ipcRenderer.send('publish', this.queue);
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

            // Ask the main process for providing connection info
            ipcRenderer.send('connectionInfo');

            ipcRenderer.on('currentProcess', (event, process) => {
                if (process.type === 'insertion') {
                    this.current = {
                        type: 'insertion',
                        title: `Publishing table ${process.table}`,
                        table: this.tables.filter(table => table.name === process.table)[0]
                    };

                    return;
                }

                this.current = {
                    type: 'indexing',
                    title: 'Indexing documents'
                }
            });

            ipcRenderer.on('rowsInserted', (event, payload) => {
                this.$store.commit('addRowsInserted', {
                    table: this.current.table,
                    inserted: parseInt(payload.count)
                });

                this.eta = Date.now() + (payload.time * (this.rows - this.rowsInserted));
            });

            ipcRenderer.on('tablePublished', (event, tableName) => {
                const table = this.tables.filter(table => table.name === tableName)[0];

                this.$store.commit('setTablePublished', table);
            });

            ipcRenderer.on('published', () => {
                // Restore app state
                this.$store.commit('restore');

                this.current = null;
                this.running = false;
                this.finished = true;
                this.eta = null;
            });
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
