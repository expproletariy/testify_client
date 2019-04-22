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
									</v-layout>
								</v-flex>
								<v-flex lg9>
									<div class="messages" ref="messageContainer">
										<v-layout column>
											<v-flex v-for="(msg, index) in messages" :key="index">
												<v-layout>
													<v-flex lg2>
														<v-icon>account_circle</v-icon>
														{{msg.user_name}} |
														{{formatTime(new Date(msg.time))}}
													</v-flex>
													<v-flex lg10>
														<p class="message-text">{{msg.text}}</p>
													</v-flex>
												</v-layout>
												<v-divider></v-divider>
											</v-flex>
										</v-layout>
									</div>
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
			this.messages.push(msg);
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
				this.roomWS = new WebSocket(`ws://${window.location.host}/ws/room?room_id=${this.activeRoom}`);
				this.roomWS.onopen = () => {
					this.$store.commit("updateUser", {id:"", name:""});
				};
				this.roomWS.onmessage = (e:any) => {
					let message = JSON.parse(e.data);
					if (this.user.id.length === 0) {
						this.$store.commit("updateUser", {id:message.user_id, name:message.user_name});
					}
					this.messages.push(message);
				};
			} catch (e) {
				console.error(e)
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