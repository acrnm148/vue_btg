export default {
    template : `
        mypage 입니다~~~
        {{name}} ( {{email}} ) 님 환영합니다~~
    `,
    data () {
        return {
            name : '강수나',
            email : 'suna@suna.com'
        }
    },
    created() {
        alert("welcome!");
    }
}