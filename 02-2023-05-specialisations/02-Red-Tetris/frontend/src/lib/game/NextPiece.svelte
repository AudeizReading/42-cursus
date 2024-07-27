<script lang="ts">
	import Square from './Square.svelte';
	import type { TetriminosArrayType } from './gameUtils';

	export let nextPiece: TetriminosArrayType = [];
</script>

<div class="containte">
	{#each nextPiece as line}
		<div class="line">
			{#each line as type}
				<Square {type} />
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	@use 'sass:map';
	@import '../../lib/scss/variables';

	.line {
		display: flex;
	}

	.containte {
		position: absolute;
		border: 1px solid $orange;
		top: 50%;
		left: 50%;
		transform: translate(
			calc(map.get($tetrisSize, 'width') * -1),
			calc(map.get($tetrisSize, 'width') * -1)
		);
		padding: 4px;
		border-radius: 4px;
	}
</style>
