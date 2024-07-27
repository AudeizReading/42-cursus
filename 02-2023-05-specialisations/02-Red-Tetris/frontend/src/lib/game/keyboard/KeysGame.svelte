<script lang="ts">
	import Controller from '../Controller.svelte';
	import Key from './Key.svelte';

	let up = false;
	let down = false;
	let left = false;
	let right = false;
	let space = false;

	const upPressed = (): void => {
		up = true;
	};
	const upRelease = (): void => {
		up = false;
	};
	const downPressed = (): void => {
		down = true;
	};
	const downRelease = (): void => {
		down = false;
	};
	const leftPressed = (): void => {
		left = true;
	};
	const leftRelease = (): void => {
		left = false;
	};
	const rightPressed = (): void => {
		right = true;
	};
	const rightRelease = (): void => {
		right = false;
	};
	const spacePressed = (): void => {
		space = true;
	};
	const spaceRelease = (): void => {
		space = false;
	};

	const controller = {
		up: upPressed,
		upUp: upRelease,
		left: leftPressed,
		leftUp: leftRelease,
		right: rightPressed,
		rightUp: rightRelease,
		down: downPressed,
		downUp: downRelease,
		space: spacePressed,
		spaceUp: spaceRelease,
	};
</script>

<Controller {...controller} />

<div class="container">
	<div class="key">
		<Key type="arrow" value="&#9664;" bind:pressed={left} />
		<p>Move to left</p>
	</div>
	<div class="key">
		<Key type="arrow" value="&#9650;" bind:pressed={up} />
		<p>Rotate</p>
	</div>
	<div class="key">
		<Key type="arrow" value="&#9660;" bind:pressed={down} />
		<p>Drop</p>
	</div>
	<div class="key">
		<Key type="arrow" value="&#9654;" bind:pressed={right} />
		<p>Move to right</p>
	</div>
	<div class="key">
		<Key type="space" value="Space" bind:pressed={space} />
		<p>HardDrop</p>
	</div>
</div>

<style lang="scss">
	@import '../../../lib/scss/variables';

	.container {
		position: fixed;
		bottom: 20px;
		right: 20px;
		padding: 10px;
		border-radius: calc(0.3em + 8px);
		box-shadow:
			rgba(0, 0, 0, 0.25) 0px 14px 28px,
			rgba(0, 0, 0, 0.22) 0px 10px 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: $white2;

		.key {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 50px;
			border-radius: calc(0.3em + 4px);
			padding: 10px;
			box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
		}
	}
</style>
