
import Main from "./components/Main.js"; //객체임
import Login from "./components/Login.js";

export default new VueRouter({
    routes: [
        { path: '/', component: Main },
        { path: '/login', component: Login },
        { path: '/main', component: Main },
    ]
});