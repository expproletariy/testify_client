<template>
	<div id="chat">
		<v-container fill-height align-centers>
			<v-layout row align-center>
				<v-flex>
					<v-card height="70vh">
						<v-card-title>Welcome to Testify chat</v-card-title>
						<v-container fill-height>
							<v-layout row>
								<v-flex lg3>
									<v-layout column>
										<v-flex>
											<v-select
													v-model="activeRoom"
													:items="rooms"
													item-text="name"
													item-value="id"
													label="Room"
											></v-select>
										</v-flex>
										<v-flex>
											<v-btn @click="connectToRoom">Connect</v-btn>
										</v-flex>
										<v-flex>
											<v-dialog width="500" v-model="dialogNewRoom">
												<template v-slot:activator="{ on }">
													<v-btn
															dark
															v-on="on"
													>
														Create new Room
													</v-btn>
												</template>
												<v-card>
													<v-card-title>New Room</v-card-title>
													<v-card-text>
														<v-text-field
																label="Username"
																v-model="newRoomName"
																maxlength="50"
																counter
														></v-text-field>
													</v-card-text>
													<v-card-actions>
														<v-btn @click="createNewRoom">Create</v-btn>
													</v-card-actions>
												</v-card>
											</v-dialog>
										</v-flex>
									</v-layout>
								</v-flex>
								<v-flex lg9>
									<div class="messages" ref="messageContainer">
										<v-container>
											<v-layout column>
												<v-flex v-for="(msg, index) in messages" :key="index">
													<v-layout>
														<v-flex md4 lg4 xl4>
															<v-menu offset-y>
																<template v-slot:activator="{ on }">
																	<v-icon v-on="on">account_circle</v-icon>
																	<div>
																		{{msg.user_name}} |
																		{{formatTime(new Date(msg.created_at))}}
																	</div>
																</template>
																<v-list>
																	<v-list-tile>
																		<v-btn @click="blockUser(msg.user_id, activeRoom, true)">Block</v-btn>
																		<v-btn @click="blockUser(msg.user_id, activeRoom, false)">DeBlock</v-btn>
																	</v-list-tile>
																</v-list>
															</v-menu>
														</v-flex>
														<v-flex md7 lg7 xl7>
															<p class="message-text">{{msg.text}}</p>
														</v-flex>
													</v-layout>
													<v-divider></v-divider>
												</v-flex>
											</v-layout>
										</v-container>
									</div>
									<v-container>
										<v-layout row>
											<v-flex>
												<v-textarea
														label="type message"
														v-model="activeMessage"
												></v-textarea>
											</v-flex>
											<v-flex>
												<v-btn @click="sendMessage">Send</v-btn>
											</v-flex>
										</v-layout>
									</v-container>
								</v-flex>
							</v-layout>
						</v-container>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import HelloWorld from '@/components/HelloWorld.vue';

	@Component({
		components: {
			HelloWorld,
		},
	})
	export default class Chat extends Vue {

		async mounted() {
			try {
				await this.$store.dispatch("getRooms");
			} catch (e) {
				console.error(e);
			}
		}

		updated() {
			let msgCont:any = this.$refs.messageContainer;
			msgCont.scrollTop = msgCont.scrollHeight;
		}

		public dialogNewRoom = false;
		public newRoomName = "";
		public activeMessage = "";
		public activeRoom = "";
		public roomWS: any = null;
		public messages:any = [];
		get rooms() {
			return this.$store.state.rooms;
		}

		get user() {
			return this.$store.state.user;
		}

		sendMessage() {
			if (this.roomWS === null) {
				return;
			}
			let msg = {
				user_id: this.user.id,
				text: this.activeMessage
			};
			this.roomWS.send(JSON.stringify(msg));
			this.activeMessage = "";
		}

		formatTime(time:Date) {
			let min:any = time.getMinutes();
			if (min < 10) {
				min = `0${min}`;
			}
			return `${time.getHours()}:${min}`;
		}

		connectToRoom() {
			try {
				this.roomWS = new WebSocket(`ws://${window.location.host}/ws/room?room_id=${this.activeRoom}&token=${this.user.token}`);
				this.roomWS.onmessage = (e:any) => {
					let message = JSON.parse(e.data);
					this.messages.push(message);
				};
				this.roomWS.onerror = (err:any) => {
					console.error(err);
					alert("Connection error, you already connected or blocked");
				};
			} catch (e) {
				console.error(e)
			}
		}
		beforeDestroy() {
			if (this.roomWS !== null) {
				this.roomWS.close();
			}
		}

		async blockUser(user_id, room_id, blocked) {
			try {
				await this.$store.dispatch("block", {user_id, room_id, blocked});
			} catch (e) {
				console.log(e);
				alert(e.message)
			}
		}

		async createNewRoom() {
			this.$store.commit("showLoader");
			try {
				let new_room_name = this.newRoomName;
				await this.$store.dispatch("createNewRoom", {new_room_name});
				this.newRoomName = "";
				this.dialogNewRoom = false;
				await this.$store.dispatch("getRooms");
				this.$store.commit("hideLoader");
			} catch (e) {
				console.error(e);
				this.$store.commit("hideLoader");
			}
		}
	}
</script>

<style lang="stylus">
	#chat
		height 100%
		width 100%
	.messages
		position relative
		overflow scroll
		max-height 60%
	.message-text
		word-wrap break-word
</style>