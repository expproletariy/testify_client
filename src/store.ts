import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		loading: false,
		rooms:[],
		user: {
			id:"",
			name:"",
			password:"",
			token:"",
		},
	},
	mutations: {
		updateRooms(state, rooms) {
			state.rooms = rooms;
		},
		updateUser(state, user) {
			state.user.id = user.id;
			state.user.name = user.name;
			state.user.password = user.password;
			state.user.token = user.token;
		},
		updateUserName(state, name) {
			state.user.name = name;
		},
		updateUserID(state, id) {
			state.user.id = id;
		},
		updateUserToken(state, token) {
			state.user.token = token;
		},
		updateUserPass(state, pass) {
			state.user.password = pass;
		},
		showLoader(state) {
			state.loading = true;
		},
		hideLoader(state) {
			state.loading = false;
		},
	},
	actions: {
		async getRooms(store) {
			let options = {
				method: "GET",
				headers:{
					"Authorization":`Bearer ${store.state.user.token}`
				}
			};
			let getRooms = await fetch("/api/v1/rooms", options);
			let response = await getRooms.json();
			store.commit("updateRooms", response.rooms)
		},
		async login(store) {
			let user = store.state.user;
			let options = {
				method: "POST",
				headers:{
					"Content-Type":"application/json"
				},
				body: JSON.stringify({name:user.name, password:user.password})
			};
			let getRooms = await fetch("/api/login", options);
			let response = await getRooms.json();
			store.commit("updateUserToken", response.token);
			store.commit("updateUserID", response.user_id);
			store.commit("updateUserPass", "");
		},
		async signin(store) {
			let user = store.state.user;
			let options = {
				method: "POST",
				headers:{
					"Content-Type":"application/json"
				},
				body: JSON.stringify({name:user.name, password:user.password})
			};
			let getRooms = await fetch("/api/sign_in", options);
			let response = await getRooms.json();
			store.commit("updateUserToken", response.token);
			store.commit("updateUserID", response.user_id);
			store.commit("updateUserPass", "");
		},
		async block(store, {room_id, user_id, blocked}) {
			let user = store.state.user;
			let options = {
				method: "POST",
				headers:{
					"Content-Type":"application/json",
					"Authorization":`Bearer ${user.token}`
				},
				body: JSON.stringify({user_id:user_id, room_id:room_id, blocked:blocked})
			};
			let getRooms = await fetch("api/v1/user/block", options);
			let response = await getRooms.json();
		},
		async createNewRoom(store, {new_room_name}) {
			let user = store.state.user;
			let options = {
				method: "POST",
				headers:{
					"Content-Type":"application/json",
					"Authorization":`Bearer ${user.token}`
				},
				body: JSON.stringify({name:new_room_name})
			};
			let newRoom = await fetch("api/v1/room/create", options);
			return await newRoom.json();
		},
		async getMessageHistory(store, {room_id, page}) {
			let user = store.state.user;
			let options = {
				method: "GET",
				headers:{
					"Authorization":`Bearer ${user.token}`
				}
			};
			let params = `?room_id=${room_id}&page=${page}`;
			let getRooms = await fetch(`/api/v1/user/messages${params}`, options);
			return await getRooms.json();
		}
	}
})
