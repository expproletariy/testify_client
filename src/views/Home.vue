<template>
	<div class="home">
		
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
	export default class Home extends Vue {}
</script>
