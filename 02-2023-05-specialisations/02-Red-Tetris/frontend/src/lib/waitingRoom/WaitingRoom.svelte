<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Game from '$lib/game/Game.svelte';
	import { username, sessionID } from '$lib/store';
	import Chat from './chat/Chat.svelte';
	import Room from './room/Room.svelte';
	import { io } from '$lib/socket';
	import { onDestroy, onMount } from 'svelte';
	import type RoomChange from '$lib/interfaces/RoomChange.interface';
	import type Player from '$lib/interfaces/Player.interface';
	import type RoomType from '$lib/interfaces/Room.interface';
	import type GameStart from '$lib/interfaces/GameStart.interface';
	import { getNotificationsContext } from 'svelte-notifications';
	import SpecterGame from '$lib/specter/SpecterGame.svelte';
	import type { RoomClosed } from '$lib/interfaces/RoomClosed.interface';
	import Button from '$lib/componante/Button.svelte';
	import type { GamePlayPayload } from '$lib/interfaces/GamePlayPayload';
	import type { GameEnd } from '$lib/interfaces/GameEnd.interface';
	import type { StatusPlayer } from '$lib/interfaces/RoomState.interface';
	import type { PlayerChange } from '$lib/interfaces/PlayerChange.interface';
	import type { Message as MessageInterface } from '$lib/interfaces/Message.interface';

	const { addNotification } = getNotificationsContext();

	let room: string;
	let user: string;
	let game: boolean = false;
	let ready: number = 0;
	let userIsReady: boolean = false;
	let statusPlayer: StatusPlayer = 'idle';

	let players: Player[] = [];
	let master: Player;

	let msgs: MessageInterface[] = [];

	const getHashValue = (): void => {
		const hash = $page.url.hash;
		const values = hash.replace('#', '').replace(']', '').split('[');
		room = values[0].replaceAll('%20', ' ');
		user = values[1];
	};

	const goHome = (): void => {
		io.emit('leaveRoom', room);
		goto('/');
	};

	onMount(() => {
		getHashValue();
		io.emit('changeUsername', user);
		io.emit('getRoom', room);
		io.on('roomInfo', (data: RoomType) => {
			if (data == null) {
				io.emit('createRoom', room);
				io.emit('getRoom', room);
				return;
			}
			if (data.name != room) return;
			const index = data.players.findIndex((x) => x.sessionID == $sessionID);
			if (index < 0) {
				io.emit('joinRoom', room);
			}
			players = data.players;
			master = data.leader;
			ready = data.totalReady;
			game = data.gameState;
			if (data.readys.filter((e) => e.sessionID == $sessionID).length == 1) {
				userIsReady = true;
			} else {
				userIsReady = false;
			}
			players
				.filter((p) => p.sessionID == $sessionID)
				.forEach((p) =>
					p.roomsState.forEach((r) => {
						if (r.name == room) {
							statusPlayer = r.status;
						}
					}),
				);
		});
		io.on('roomChange', (data: RoomChange) => {
			if (data.room.name != room) return;
			switch (data.reason) {
				case 'player incoming':
					if (players.filter((e) => e.sessionID == data.player.sessionID).length == 0)
						players = [...players, data.player];
					break;
				case 'player outgoing':
					players.splice(
						players.findIndex((x) => x.sessionID == data.player.sessionID),
						1,
					);
					players = players;
					break;
				case 'new leader':
					master = data.room.leader;
					break;
			}
		});
		io.on('gameStart', (data: GameStart) => {
			if (data.roomName != room) return;
			if (userIsReady && data.reason === 'start') {
				game = true;
			} else if (userIsReady && data.reason == 'time') {
				addNotification({
					text: data?.message,
					position: 'top-right',
					type: 'succes',
					removeAfter: 1000,
				});
			}
		});
		io.on('roomClosed', (data: RoomClosed) => {
			if (data.room.name == room) goto('/');
		});
		io.on('gameEnd', (data: GamePlayPayload<GameEnd>) => {
			if (data.payload.player.sessionID == $sessionID) {
				io.emit('getRoom', room);
			}
		});
		io.on('playerChange', (data: PlayerChange) => {
			if (data.player.sessionID != $sessionID) return;
			data.player.roomsState.forEach((roomState) => {
				if (roomState.name == room) {
					statusPlayer = roomState.status;
				}
			});
		});
	});

	onDestroy(() => {
		io.off('roomInfo');
		io.off('roomChange');
		io.off('roomClosed');
		io.off('gameStart');
		io.off('gameEnd');
		io.off('playerChange');
	});

	$: if ($page.url.hash) {
		getHashValue();
	}

	$: if (user && user != $username) {
		username.set(user);
	}
</script>

{#if game && statusPlayer != 'idle'}
	<Game {room} />
{:else}
	<div>
		<SpecterGame bind:room fixed={false} isWaitingRoom={true} bind:msgs />
		<Button class="btnListRoom" on:click={goHome}>Leave</Button>
		<div>
			<Room bind:players bind:master />
			<Chat bind:ready bind:userIsReady bind:room bind:players bind:master bind:msgs />
		</div>
	</div>
{/if}

<style lang="scss">
	:global(.btnListRoom) {
		position: absolute;
		top: 10px;
		right: 10px;
	}

	div {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
</style>
