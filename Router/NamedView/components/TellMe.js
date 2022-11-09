export default {
    template: `
        <div>
        <div id="editor">CK Editor 영역</div>
        <button type="button" class="btn btn-success" @click="sendTellMe">Send</button>
        </div>
    `,
    data() {
        return {
            CKEditor: null
        }
    }, 
    methods: {
        sendTellMe() {
            let message = this.CKEditor.getData();
            alert(message);
        }
    },
    async mounted() {
        this.CKEditor = await ClassicEditor.create(document.querySelector('#editor'));
    }
}