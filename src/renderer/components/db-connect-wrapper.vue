<template>
    <div>
        <connect type="mssql" v-if="$store.state.step === 1" @connected="next" key="step1"/>
        <connect type="mongodb" v-else-if="$store.state.step === 2" @connected="next"  key="step2"/>
    </div>
</template>

<script>
    import Connect from './db-connect';

    export default {
        data() {
            return {

            };
        },

        methods: {
            next() {
                this.$store.commit('nextStep');
            }
        },

        components: {Connect}
    }
</script>

<style lang="scss">

</style>
