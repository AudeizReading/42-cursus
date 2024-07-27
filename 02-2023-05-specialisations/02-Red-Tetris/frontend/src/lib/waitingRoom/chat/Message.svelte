<script lang="ts">
	import ImageUser from '$lib/componante/ImageUser.svelte';

	export let message: string;
	export let username: string | undefined;
	export let me: boolean = false;
	export let system: boolean = false;
</script>

<div class="message" class:me class:system>
	{#if !system && typeof username != 'undefined'}
		<ImageUser bind:username />
	{/if}
	<p>{message}</p>
</div>

<style lang="scss">
	@import '../../../lib/scss/variables';

	.message {
		padding: 10px;
		border-radius: 10px;
		background: $black;
		color: $white70;
		position: relative;
		max-width: 25vw;
		gap: 10px;
		display: flex;
		align-items: center;

		p {
			max-width: calc(25vw - 100px);
		}
	}

	.me {
		margin-left: 25vw;
	}

	.system {
		background: transparent !important;
		color: $black;
	}
</style>
