<script lang="ts">
	type ButtonType = 'button' | 'submit' | 'reset' | null | undefined;
	export let type: ButtonType = undefined;
	let className: string = '';
	export { className as class };
</script>

<button class={className} {type} on:click><slot /></button>

<style lang="scss">
	button {
		max-width: 200px;
		padding: 10px;
		border-radius: 10px;
		border: none;
	}
</style>
