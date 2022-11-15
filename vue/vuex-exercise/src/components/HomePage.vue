<template>
    <div>
        <div>HomePage</div>
        <hr>
        <h4>from data</h4>
        {{message}} {{count}} <!--스토어에서 처음 가져왔다고 해서 변경사항이 자동으로 바뀌는건 아님.-->
        <hr>
        <h4>from data</h4>
        {{$store.state.message}}  {{$store.state.count}} 
        <hr>
        <h4>from store getters</h4>
        {{$store.getters.getReversedMessage}}  {{$store.getters.isCountEven}} 
        <hr>
        <h4>from store map getters</h4>
        {{getReversedMessage}}  {{checkCountIsEven}} 
        <hr>
        <HomeSub></HomeSub>
    </div>
</template>

<script>
import HomeSub from '@/components/HomeSub.vue'
import {mapGetters} from 'vuex'
export default {
    components: {HomeSub},
    data() {
        return {
            message: this.$store.state.message, //데이터가져올때는 최초 한번
            count : this.$store.state.count,
        }
    },
    computed : {
        ...mapGetters(['getReversedMessage']),
        ...mapGetters({checkCountIsEven:'isCountEven'}),
    }
}
</script>

<style>
    
</style>

