<template>
	<div id="app">
		<v-app>
			<v-toolbar app>
				<v-toolbar-title>Testify chat</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items class="hidden-sm-and-down">
					<v-btn to="/" flat>Home</v-btn>
					<v-btn to="/chat" flat>Chat</v-btn>
					<v-btn to="/messages" flat>Messages</v-btn>
					<v-btn to="/login" flat>LogIn</v-btn>
					<v-btn to="/sign_in" flat>SignIn</v-btn>
				</v-toolbar-items>
			</v-toolbar>
			<v-content>
				<router-view></router-view>
			</v-content>
			<v-footer app>
				<v-progress-linear v-if="showLoader" :indeterminate="true"></v-progress-linear>
			</v-footer>
		</v-app>
	</div>
</template>
<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';

	@Component
	export default class App extends Vue {
		get showLoader() {
			return this.$store.state.loading;
		}
	}
</script>
<style lang="stylus">
	#app
		font-family 'Avenir', Helvetica, Arial, sans-serif
		-webkit-font-smoothing antialiased
		-moz-osx-font-smoothing grayscale
	@font-face
		font-family "Material Icons"
		font-style normal
		font-weight 400
		src: url(./assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format("woff2")
	.material-icons
		font-family "Material Icons"
		font-weight normal
		font-style normal
		font-size 24px
		line-height 1
		letter-spacing normal
		text-transform none
		display inline-block
		white-space nowrap
		word-wrap normal
		direction ltr
		-webkit-font-feature-settings "liga"
		-webkit-font-smoothing antialiased
</style>
