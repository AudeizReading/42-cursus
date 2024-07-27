<script lang="ts">
	import Button from '$lib/componante/Button.svelte';
	import { onMount } from 'svelte';
	export let show: boolean;

	onMount(() => {
		document.addEventListener('keydown', closeOnEscape);
		return (): void => document.removeEventListener('keydown', closeOnEscape);
	});

	const closeOnEscape = (e: KeyboardEvent): void => {
		if (e.code != 'Escape') return;
		close();
	};

	const close = (): void => {
		show = false;
	};
</script>

{#if show}
	<button on:click={close} class="background" />
	<div class="modal">
		<Button class="button" on:click={close}>Close</Button>
		<div class="content">
			<slot />
		</div>
	</div>
{/if}

<style lang="scss">
	@import '../scss/variables.scss';
	.modal {
		z-index: 10;
		background: white;
		border: 0.5px solid $orange;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 40px 30px 30px 30px;
		border-radius: 10px;
		box-shadow: rgba(255, 162, 0, 0.2) 0px 7px 29px 0px;

		.content {
			margin-top: 15px;
		}

		:global(.button) {
			position: fixed;
			top: 10px;
			right: 10px;
		}
	}

	.background {
		width: 100vw;
		height: 100vh;
		background: $yellow;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		opacity: 0.1;
		border: none;
		cursor: default;
	}
</style>
