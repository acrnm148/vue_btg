export default {
    template: `
    <div class="card mt-3">
        <img src="https://picsum.photos/1024/400/?image=25" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">Mail</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" class="btn btn-primary" @click="checkMail">check Mail</a>
        </div>
        {{from}} {{content}}
    </div>
    `,
    data() {
        return {
            from: this.$route.query.from,
            content: this.$route.query.content //받을 때는 $route
        }
    },
    methods: {
        checkMail() {
            console.log(this.from);
            if (this.from) { //null이 아닐 때
                alert(this.from+" "+this.content);
            } else {
                alert("no mail");
            }
        }
    }
}