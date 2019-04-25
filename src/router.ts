import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"
import About from "./views/About.vue"
import Chat from "./views/Chat.vue"
import LoIn from "./views/Login.vue"
import SignIn from "./views/Signin.vue"
import Messages from "./views/Messages.vue"

Vue.use(Router);

export default new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/",
			name: "home",
			component: Home
		},
		{
			path: "/about",
			name: "about",
			component: About
		},
		{
			path: "/chat",
			name: "chat",
			component: Chat
		},
		{
			path: "/sign_in",
			name: "signin",
			component: SignIn
		},
		{
			path: "/login",
			name: "login",
			component: LoIn
		},
		{
			path: "/messages",
			name: "messages",
			component: Messages
		}
	]
})
