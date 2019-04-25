<template>
	<div id="login">
		<v-container fill-height align-center>
			<v-layout column align-center align-content-space-around>
				<v-card class="login-card">
					<v-container>
						<v-layout column align-content-space-around>
							<div class="custom-error">{{ errorMessage }}</div>
							<v-flex>
								<v-card-title>Login</v-card-title>
							</v-flex>
							<v-flex>
								<v-card-text>
									<v-text-field
											label="Username"
											v-model="User.name"
											maxlength="50"
											counter
									></v-text-field>
									<v-text-field
											label="Password"
											v-model="User.password"
											counter
											type="password"
											maxlength="20"
									></v-text-field>
								</v-card-text>
							</v-flex>
							<v-flex align-self-centers>
								<v-card-actions>
									<v-container>
										<v-layout row>
											<v-flex>
												<v-btn @click="login">Login</v-btn>
											</v-flex>
										</v-layout>
									</v-container>
								</v-card-actions>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';

	@Component
	export default class Login extends Vue {
		public errorMessage: string = "";
		get User() {
			return this.$store.state.user;
		}
		get showLoader() {
			return this.$store.state.loading;
		}

		async login() {
			this.errorMessage = "";
			try {
				 this.$store.commit("showLoader");
				 await this.$store.dispatch("login");
				 this.$store.commit("hideLoader");
				 this.$router.push("/chat");
			} catch (e) {
				this.$store.commit("hideLoader");
				this.errorMessage = e.messages;
			}
		}
	}
</script>

<style lang="stylus">
	#login
		width 100%
		height 100%
	.login-card
		width 40vw
	.custom-error
		color: rgb(255,0,0)
</style>
