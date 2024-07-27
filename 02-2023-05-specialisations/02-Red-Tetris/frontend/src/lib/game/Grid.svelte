<script lang="ts">
	import GridView from './GridView.svelte';
	import Square from './Square.svelte';
	import type { TetriminosArrayType } from './gameUtils';

	export let tab: TetriminosArrayType = [];
</script>

<GridView />

{#each tab as line}
	<div class="line">
		{#each line as type}
			<Square {type} />
		{/each}
	</div>
{/each}

<style lang="scss">
	.line {
		display: flex;
	}
</style>
