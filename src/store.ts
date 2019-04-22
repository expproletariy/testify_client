import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		rooms:[],
		user: {
			id:"",
			name:"",
		}
	},
	mutations: {
		updateRooms(state, rooms) {
			state.rooms = rooms;
		},
		updateUser(state, user) {
			state.user.id = user.id;
			state.user.name = user.name;
		}
	},
	actions: {
		async getRooms(store) {
			let getRooms = await fetch("/api/rooms");
			let response = await getRooms.json();
			store.commit("updateRooms", response.rooms)
		}
	}
})
