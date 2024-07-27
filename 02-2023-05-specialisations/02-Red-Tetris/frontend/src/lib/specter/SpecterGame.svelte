<script lang="ts">
	import type PlayerGame from '$lib/interfaces/PlayerGame.interface';
	import { sessionID, effectLevel, effectMute } from '$lib/store';
	import { onDestroy, onMount } from 'svelte';
	import PlayerSpecter from './PlayerSpecter.svelte';
	import { io } from '$lib/socket';
	import { convertPlayerGameToSpecter, normalizeSocketToPlayerGame } from './specter.utils';
	import type { GameInfo } from '$lib/interfaces/GameInfo.interface';
	import type { GamePlayPayloads } from '$lib/interfaces/GamePlayPayload';
	import type RoomChange from '$lib/interfaces/RoomChange.interface';
	import { gameIdToRoomName } from '$lib/gameIdToRoomName';
	import type { Message as MessageInterface } from '$lib/interfaces/Message.interface';
	import { getNotificationsContext } from 'svelte-notifications';

	export let room: string;
	export let fixed: boolean = true;
	export let isWaitingRoom: boolean = false;
	export let msgs: MessageInterface[] = [];

	let playerGame: PlayerGame[] = [];
	let roomName: string;

	let winAudio: HTMLAudioElement;

	const { addNotification } = getNotificationsContext();

	const addSystemMessage = (msg: string): void => {
		msgs = [
			...msgs,
			{
				message: msg,
				username: undefined,
				system: true,
			},
		];
	};

	onMount(() => {
		winAudio = new Audio('/sounds/win.mp3');
		winAudio.volume = $effectMute ? 0 : $effectLevel;
		io.on('gameInfo', (data: GamePlayPayloads<GameInfo>) => {
			const normalizeGameInfo: PlayerGame[] = [];
			roomName = gameIdToRoomName(data.gameId);
			if (roomName != room) return;
			data.payload.forEach((player) => {
				normalizeGameInfo.push(normalizeSocketToPlayerGame(player));
			});
			playerGame = normalizeGameInfo;
		});
		io.on('roomChange', (data: RoomChange) => {
			if (data.reason == 'new winner' && data.room.name == roomName) {
				playerGame = [];
				const messageWin =
					data.player.sessionID == $sessionID
						? `Congratulation You Win!`
						: `Congratulation for new winner ${data.player.username}`;
				if (data.player.sessionID == $sessionID) {
					winAudio.volume = $effectMute ? 0 : $effectLevel;
					winAudio.play();
				}
				addNotification({
					text: messageWin,
					position: 'top-right',
					type: 'success',
					removeAfter: 5000,
				});
				addSystemMessage(`${data.reason}: ${data.player.username}`);
			} else if (data.reason == 'new leader' && data.room.name == roomName) {
				addSystemMessage(`${data.reason}: ${data.room.leader.username}`);
			}
		});
	});

	onDestroy(() => {
		io.off('gameInfo');
		io.off('roomChange');
	});
</script>

{#if !isWaitingRoom || (isWaitingRoom && playerGame.length != 0)}
	<div class="specterGame" class:fixed>
		{#if playerGame.length == 0}
			<p>Unable to find any opponent.</p>
		{:else}
			<p>
				Only {playerGame.filter((p) => !p.endGame).length} / {playerGame.length}
				players are still in the game.
			</p>
			<div class="players">
				{#each playerGame
					.filter((p) => p.player.sessionID != $sessionID)
					.map((p) => {
						return convertPlayerGameToSpecter(p, isWaitingRoom);
					}) as player}
					<PlayerSpecter {player} {isWaitingRoom} />
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	@import '../../lib/scss/variables';

	.fixed {
		position: fixed;
		bottom: 15px;
		left: 15px;
	}

	.specterGame {
		box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
		background: $white2;
		padding: 15px;
		border-radius: 10px;
		max-width: 320px;

		p {
			text-align: center;
		}

		.players {
			justify-content: center;
			margin-top: 25px;
			max-height: calc(100vh - 300px);
			overflow: auto;
			display: flex;
			flex-wrap: wrap;
		}
	}
</style>
