<template>
    <div id="app" class="h-100">
        <db-connect/>
    </div>
</template>

<script>
    import Sidebar from './components/sidebar';
    import DbConnect from './components/db-connect-wrapper';

    export default {
        components: {DbConnect, Sidebar}
    }
</script>
