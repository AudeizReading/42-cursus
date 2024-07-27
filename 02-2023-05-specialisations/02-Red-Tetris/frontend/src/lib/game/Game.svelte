<script lang="ts">
	import Grid from './Grid.svelte';
	import Controller from './Controller.svelte';
	import KeysGame from './keyboard/KeysGame.svelte';
	import Sound from './Sound.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { io } from '$lib/socket';
	import type { TetriminosArrayType } from './gameUtils';
	import NextPiece from './NextPiece.svelte';
	import Score from './Score.svelte';
	import type { GameChange } from '$lib/interfaces/GameChange.interface';
	import SpecterGame from '$lib/specter/SpecterGame.svelte';
	import type { GamePlayPayload } from '$lib/interfaces/GamePlayPayload';
	import { gameIdToRoomName } from '$lib/gameIdToRoomName';

	export let room: string;

	const up = (): void => {
		io.emit('gameChange', { action: 'up', room });
	};

	const down = (): void => {
		io.emit('gameChange', { action: 'down', room });
	};

	const left = (): void => {
		io.emit('gameChange', { action: 'left', room });
	};

	const right = (): void => {
		io.emit('gameChange', { action: 'right', room });
	};

	const space = (): void => {
		io.emit('gameChange', { action: 'space', room });
	};

	let tab: TetriminosArrayType = [];

	let nextPiece: TetriminosArrayType = [];

	const controller = { up, down, left, right, space };

	let effects: { [key: string]: HTMLAudioElement };

	let level: number = 0;
	let score: number = 0;

	onMount(() => {
		io.on('gameChange', (data: GamePlayPayload<GameChange>) => {
			const roomName = gameIdToRoomName(data.gameId);
			if (room != roomName) return;
			tab = data.payload.map;
			nextPiece = data.payload.nextPiece;
			if (data.payload?.soundEffect) {
				data.payload.soundEffect.forEach((effect) => {
					effects[effect].play();
				});
			}
			level = data.payload.level;
			score = data.payload.score;
		});
	});

	onDestroy(() => {
		io.off('gameChange');
	});
</script>

<Controller {...controller} />
<KeysGame />
<NextPiece bind:nextPiece />
<Sound bind:effects />
<Score bind:score bind:level />
<SpecterGame bind:room />

<div class="content">
	<div class="game">
		<Grid bind:tab />
	</div>
</div>

<style lang="scss">
	@use 'sass:map';
	@import '../../lib/scss/variables';

	.content {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;

		.game {
			width: map.get($tetrisSize, 'width');
			height: map.get($tetrisSize, 'height');
			border: 1px solid $black;
			border-radius: 3px;
			overflow: hidden;
			position: relative;
		}
	}
</style>
