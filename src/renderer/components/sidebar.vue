<template>
    <div id="sidebar" v-loading="!initialized">
        <el-card class="wrapper">
            <div slot="header">
                <span :class="['d-flex align-items-center title-wrapper', showPublishBtn?'justify-content-between':'justify-content-center']">
                   <span>
                       <i class="fas fa-table icon"></i>&nbsp; Tables
                   </span>

                    <el-button size="small" type="success" v-show="showPublishBtn" @click="publish"
                               :disabled="!!queue.length" plain>Publish</el-button>
                </span>
            </div>
            <div>
                <el-checkbox v-for="(table, index) in tables"
                             :key="index"
                             v-model="table.checked"
                             :disabled="0 < queue.length || table.published"
                             class="table">
                    <span class="label">
                        <span>{{table.name}}</span>
                        <span>
                            <i :class="table.published?'el-icon-success':table.publishing?'el-icon-loading':''"></i>
                        </span>
                    </span>
                </el-checkbox>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {ipcRenderer} from "electron";

    export default {
        data() {
            return {
                initialized: false,
            };
        },
        computed: {
            showPublishBtn() {
                return this.tables.some(table => table.checked);
            },

            tables() {
                return this.$store.state.tables;
            },

            queue() {
                return this.$store.state.queue;
            }
        },

        methods: {
            publish() {
                // Add checked tables to the queue
                this.tables.forEach(table => {
                    if (table.checked && !this.queue.includes(table)) {
                        this.$store.commit('addToQueue', table);
                    }
                });

                this.$emit('published');
            }
        },

        created() {

            // Get tables from the main process
            ipcRenderer.on('getTables', (event, tables) => {
                tables.forEach(table => {
                    this.$store.commit('addTable', {
                        name: table.name,
                        checked: false,
                        published: table.published,
                        publishing: false,
                        rows: {
                            total: parseInt(table.rows),
                            inserted: 0
                        }
                    });
                });

                this.initialized = true;
            });

            // Ask the main process for providing tables
            ipcRenderer.send('provideTables');
        }
    }
</script>

<style lang="scss">
    @import "../styles/var";


    #sidebar {
        align-self: flex-start;
        position: sticky;
        top: 0;

        .wrapper {
            width: 300px;
            height: calc(100vh - 2px);
            border-radius: 0;
            overflow-y: auto;
        }

        .el-card__header {
            position: sticky;
            top: 0;
            z-index: 2;
            padding: 30px 20px;
            background: #fff;
        }

        .el-card__body {
            padding: 0;
        }

        .table {
            display: block;
            padding: 15px;
            margin-right: 0;
            border-bottom: 1px solid $--border-color-light;

            .el-checkbox__label {
                width: calc(100% - 20px);

                i {
                    color: green;
                }
            }

            .label {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }

        .title-wrapper {
            height: 32px;
        }
    }
</style>
