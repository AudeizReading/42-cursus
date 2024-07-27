<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} - {$page.error?.message} | Red Tetris</title>
</svelte:head>

<div>
	<h1>{$page.status}</h1>
	<p>{$page.error?.message}</p>
	<a href="/">Comme back to Home</a>
</div>

<style lang="scss">
	@import '../lib/scss/variables';

	div {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 100vh;
		color: $white2;

		h1 {
			font-size: 100px;
		}

		p {
			font-size: 30px;
		}

		a {
			font-size: 24px;
			color: $white2;
		}
	}
</style>
