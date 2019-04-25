<template>
	<div id="messages">
		<v-container>
			<v-layout column>
				<v-flex>
					<v-layout>
						<v-select
								v-model="activeRoom"
								:items="rooms"
								item-text="name"
								item-value="id"
								label="Room"
						></v-select>
						<v-btn @click="getMessages">Search</v-btn>
					</v-layout>
				</v-flex>
				<v-flex>
					<div class="message-table-container">
						<v-data-table
								:headers="MessageTable.Headers"
								:items="MessageTable.Items"
								hide-actions
								:pagination.sync="pagination"
						>
							<template slot="items" slot-scope="props">
								<td>{{ props.item.user_name }}</td>
								<td class="text-xs-right">{{formatTime(new Date(props.item.created_at))}}</td>
								<td class="text-xs-right">{{ props.item.text }}</td>
							</template>
						</v-data-table>
					</div>
				</v-flex>
				<v-flex>
					<v-container class="navigation-container">
						<v-layout align-content-center>
							<v-flex align-self-center>
								<v-btn block @click="beforePage"><v-icon>navigate_before</v-icon></v-btn>
							</v-flex>
							<v-flex align-self-center>
								<v-btn block @click="nextPage"><v-icon>navigate_next</v-icon></v-btn>
							</v-flex>
						</v-layout>
					</v-container>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import HelloWorld from "@/components/HelloWorld.vue";

	@Component
	export default class Messages extends Vue {
		public messages:any = [];
		public activeRoom = "";
		public page = 1;
		MessageTable = {
			Headers: [
					{
						text: "User name",
						align: "left",
						sortable: false,
						value: "user_name"
					},
					{ text: "Time", value: "created_at" },
					{ text: "Text", value: "text" },
				],
			Items: []

		};
		pagination = {
			rowsPerPage:20,
			totalItems:20
		};

		get rooms() {
			return this.$store.state.rooms;
		}

		get user() {
			return this.$store.state.user;
		}
		async mounted() {
			try {
				await this.$store.dispatch("getRooms");
			} catch (e) {
				console.error(e);
			}
		}
		formatTime(time:Date) {
			let min:any = time.getMinutes();
			if (min < 10) {
				min = `0${min}`;
			}
			return `${time.getHours()}:${min}`;
		}
		async getMessages() {
			this.$store.commit("showLoader");
			try {
				let resp = await this.$store.dispatch("getMessageHistory", {page:this.page, room_id:this.activeRoom});
				if (resp.messages == null) {
					this.page--;
					this.$store.commit("hideLoader");
					return;
				}
				this.MessageTable.Items = resp.messages;
				this.$store.commit("hideLoader");
			} catch (e) {
				this.$store.commit("hideLoader");
				console.error(e);
			}
		}

		async nextPage() {
			this.page++;
			await this.getMessages();
		}
		async beforePage() {
			if (this.page == 1) {
				return
			}
			this.page--;
			await this.getMessages();
		}

	}
</script>

<style lang="stylus">
	.message-table-container
		height 50vh
		overflow scroll
	.navigation-container
		width 30vw
</style>
