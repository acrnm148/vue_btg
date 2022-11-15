<template>
<div>
    <div>Home Sub</div>
    {{$store.state.message}} {{$store.state.count}}
    <button @click="changeCount">change count to 10</button>
    <button @click="changeMessage">change message to ssafy</button>
</div>
</template>

<script>
export default {
    methods: {
        changeCount() {
            this.$store.dispatch('setCount',10);
        },
        changeMessage() {
            this.$store.dispatch('setMessage',"SSAFY");
        }
    }
}
</script>

<style>
    
</style>

