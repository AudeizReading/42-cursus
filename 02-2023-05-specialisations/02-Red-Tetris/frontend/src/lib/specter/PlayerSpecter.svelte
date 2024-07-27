<script lang="ts">
	import type PlayerGame from '$lib/interfaces/PlayerGame.interface';

	export let player: PlayerGame;
	export let isWaitingRoom: boolean;
</script>

<div class="playerSpecter">
	{#if player.endGame}
		<div class="death left" />
		<div class="death right" />
	{/if}
	<p>{player.player.username}</p>
	<div class="map">
		{#each player.map as map}
			<div class="line">
				{#each map as c}
					{#if c == ''}
						<div class="case empty" />
					{:else}
						<div class="case {isWaitingRoom ? c : 'full'}" />
					{/if}
				{/each}
			</div>
		{/each}
	</div>
	<div class="meta">
		<p>Score: {player.score}</p>
		<p>Level: {player.level}</p>
	</div>
</div>

<style lang="scss">
	@use 'sass:map';
	@import '../../lib/scss/variables';

	.playerSpecter {
		box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
		padding: 15px;
		border-radius: 10px;
		position: relative;
		overflow: hidden;

		p {
			display: flex;
			justify-content: center;
		}

		.meta {
			display: flex;
			flex-direction: column;
			align-items: start;
		}

		.death {
			border-radius: 10px;
			width: 100%;
			height: 10px;
			background: red;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 0;
		}

		.left {
			transform: rotate(45deg);
		}

		.right {
			transform: rotate(-45deg);
		}

		.map {
			display: flex;
			flex-direction: column;

			.line {
				display: flex;

				.case {
					width: 10px;
					height: 10px;
					border: 1px solid black;

					&.empty {
						background: black;
					}

					&.full {
						background: white;
					}

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
				}
			}
		}
	}
</style>
