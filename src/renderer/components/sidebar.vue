<template>
    <div id="sidebar">
        <el-card class="wrapper">
            <div slot="header">
                <span :class="['d-flex align-items-center title-wrapper', showPublishBtn?'justify-content-between':'justify-content-center']">
                   <span>
                       <i class="fas fa-table icon"></i>&nbsp; Tables
                   </span>

                    <el-button size="small" type="success" v-show="showPublishBtn" @click="publish" plain><i
                            class="fas fa-file-export"></i>&nbsp;&nbsp;Publish</el-button>
                </span>
            </div>
            <div>
                <el-checkbox v-for="(table, index) in tables"
                             :key="index"
                             v-model="table.checked"
                             :disabled="queue.includes(table)"
                             class="table">
                    <span class="label">
                        <span>{{table.name}}</span>
                        <span>
                            <i :class="queue.includes(table)?'el-icon-loading':table.published?'el-icon-success':''"></i>
                        </span>
                    </span>
                </el-checkbox>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
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
                this.tables.forEach(table => {
                    if (table.checked && !this.queue.includes(table)) {
                        this.$set(table.rows, 'finished', 0);
                        this.$store.commit('addToQueue', table);
                    }
                });

                this.$emit('published');
            }
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
