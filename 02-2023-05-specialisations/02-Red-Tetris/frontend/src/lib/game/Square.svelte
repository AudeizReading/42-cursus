<script lang="ts">
	import type { TetriminosType } from './gameUtils';

	export let type: TetriminosType | '' = '';
</script>

<div class="square {type}" class:visible={type != ''} class:invisible={type == ''}>
	<div class="lumens" />
</div>

<style lang="scss">
	@use 'sass:map';
	@import '../../lib/scss/variables';

	$top: 1px;
	$right: 2px;

	.visible {
		border-top: $top solid $black;
		border-left: $top solid $black;
		border-right: $right solid $black;
		border-bottom: $right solid $black;
		width: calc(map.get($tetriminos, 'size') - ($top + $right));
		height: calc(map.get($tetriminos, 'size') - ($top + $right));

		&.I {
			background: map.get($tetriminos, 'colors', 'I');
		}
		&.O {
			background: map.get($tetriminos, 'colors', 'O');
		}
		&.T {
			background: map.get($tetriminos, 'colors', 'T');
		}
		&.L {
			background: map.get($tetriminos, 'colors', 'L');
		}
		&.J {
			background: map.get($tetriminos, 'colors', 'J');
		}
		&.Z {
			background: map.get($tetriminos, 'colors', 'Z');
		}
		&.S {
			background: map.get($tetriminos, 'colors', 'S');
		}
		&.G {
			background: map.get($tetriminos, 'colors', 'G');
		}

		.lumens {
			position: absolute;
			border-radius: 100%;
			background: white;
			width: calc(map.get($tetriminos, 'size') * 0.2);
			height: calc(map.get($tetriminos, 'size') * 0.2);
			top: calc(map.get($tetriminos, 'size') * 0.1);
			left: calc(map.get($tetriminos, 'size') * 0.1);
		}
	}

	.invisible {
		width: map.get($tetriminos, 'size');
		height: map.get($tetriminos, 'size');
	}

	.square {
		overflow: hidden;
		position: relative;
		flex-grow: 0;
		flex-shrink: 0;
	}
</style>
