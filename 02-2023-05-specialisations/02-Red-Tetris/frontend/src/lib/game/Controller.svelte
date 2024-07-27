<script lang="ts">
	import controller from '$lib/game/controller';

	export let up: () => void = () => {};
	export let down: () => void = () => {};
	export let space: () => void = () => {};
	export let left: () => void = () => {};
	export let right: () => void = () => {};

	export let upUp: () => void = () => {};
	export let downUp: () => void = () => {};
	export let spaceUp: () => void = () => {};
	export let leftUp: () => void = () => {};
	export let rightUp: () => void = () => {};

	const keydown = (e: KeyboardEvent & { currentTarget: EventTarget & Window }): void => {
		controller(e, { up, down, left, right, space });
	};

	const keyup = (e: KeyboardEvent & { currentTarget: EventTarget & Window }): void => {
		controller(e, { up: upUp, down: downUp, left: leftUp, right: rightUp, space: spaceUp });
	};
</script>

<svelte:window on:keydown={keydown} on:keyup={keyup} />
