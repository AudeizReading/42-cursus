<script lang="ts">
	import Message from './Message.svelte';
	import { sessionID } from '$lib/store';
	import type Player from '$lib/interfaces/Player.interface';
	import type { Message as MessageInterface } from '$lib/interfaces/Message.interface';
	import { onDestroy, onMount } from 'svelte';
	import { io } from '$lib/socket';
	import type RoomChange from '$lib/interfaces/RoomChange.interface';
	import Modal from '$lib/componante/Modal.svelte';
	import type { MessageSocket } from '$lib/interfaces/MessageSocket.interface';
	import type { PlayerChange } from '$lib/interfaces/PlayerChange.interface';
	import Button from '$lib/componante/Button.svelte';
	import type { GamePlayPayloads } from '$lib/interfaces/GamePlayPayload';
	import type { GameInfo } from '$lib/interfaces/GameInfo.interface';
	import { gameIdToRoomName } from '$lib/gameIdToRoomName';

	export let master: Player;
	export let players: Player[];
	export let room: string;
	export let ready = 0;
	export let userIsReady: boolean;
	export let msgs: MessageInterface[] = [];

	let chat: HTMLDivElement;
	let inputMessage: HTMLElement;
	let gameInProgress: boolean = false;
	let roomName: string;

	const autoScrollDown = (): void => {
		if (typeof chat != 'undefined') {
			if (chat?.scrollHeight) {
				chat.scrollTop = chat.scrollHeight;
			}
		}
	};

	let newMessage: string = '';

	let modalViewRunGame: boolean = false;

	const addSystemMessage = (msg: string): void => {
		msgs = [
			...msgs,
			{
				message: msg,
				username: undefined,
				system: true,
			},
		];
		setTimeout(() => {
			autoScrollDown();
		}, 100);
	};

	onMount(() => {
		io.on('message', (data: MessageSocket) => {
			if (data.receiver.name != room) return;
			msgs = [
				...msgs,
				{
					message: data.message,
					username: data.emitter.username,
					me: data.emitter.sessionID == $sessionID,
				},
			];
			setTimeout(() => {
				autoScrollDown();
				inputMessage.focus();
			}, 100);
		});
		io.on('roomChange', (data: RoomChange) => {
			if (data.reason == 'new winner' && data.room.name == roomName) {
				gameInProgress = false;
			}
			if (data.room.name != room || data.reason == 'ready') return;
			if (data.reason != 'new winner') {
				addSystemMessage(
					`${data.reason}: ${
						data.reason != 'new leader'
							? data.player.username
							: data.room.leader.username
					}
					`,
				);
			}
		});
		io.on('playerChange', (data: PlayerChange) => {
			if (data.reason != 'ready') return;
			const statusRoom = data.player?.roomsState.filter((e) => e.name == room)[0];
			ready = statusRoom.readys;
			io.emit('getRoom', room);
			addSystemMessage(
				`${data.player.username} ${statusRoom.status == 'ready' ? 'set' : 'unset'} ready`,
			);
		});
		io.on('gameInfo', (data: GamePlayPayloads<GameInfo>) => {
			roomName = gameIdToRoomName(data.gameId);
			if (roomName != room) return;
			gameInProgress = true;
		});
	});

	onDestroy(() => {
		io.off('message');
		io.off('roomChange');
		io.off('playerChange');
		io.off('gameInfo');
	});

	const onSubmit = (): void => {
		if (!newMessage) return;
		io.emit('message', {
			message: newMessage,
			receiver: room,
		});
		newMessage = '';
	};

	const toggleReady = (): void => {
		io.emit('ready', room);
		io.emit('getRoom', room);
	};

	const forceGameStart = (): void => {
		if (!userIsReady) {
			io.emit('gameStart', room);
		}
		modalViewRunGame = false;
		io.emit('getRoom', room);
	};

	const cancelForceGameStart = (): void => {
		if (userIsReady) {
			io.emit('gameStart', room);
		}
		modalViewRunGame = false;
		io.emit('getRoom', room);
	};

	const toggleModalViewRunGame = (): void => {
		modalViewRunGame = !modalViewRunGame;
		io.emit('getRoom', room);
	};
</script>

<Modal bind:show={modalViewRunGame}>
	<p>Are you sure launch game?</p>
	{#if players.length != 1}
		<p>Other player {userIsReady ? ready - 1 : ready} / {players.length - 1} ready</p>
	{/if}
	<div class="buttonModalViewRunGame">
		<Button on:click={forceGameStart}>Yes</Button>
		<Button on:click={cancelForceGameStart}>No</Button>
	</div>
</Modal>

<div class="content">
	<div class="ready">
		{#if !gameInProgress}
			<p>{ready} player{ready > 1 ? 's' : ''} ready of {players.length}</p>
			{#if $sessionID != master?.sessionID}
				<Button on:click={toggleReady}>
					{#if userIsReady}
						Unset ready
					{:else}
						Set ready
					{/if}
				</Button>
			{:else}
				<Button on:click={toggleModalViewRunGame}>Run Game</Button>
			{/if}
		{:else}
			<p>Game in progress</p>
		{/if}
	</div>

	<div class="chat" bind:this={chat}>
		{#if msgs.length == 0}
			<p>No messages</p>
		{/if}
		{#each msgs as message}
			<Message {...message} />
		{/each}
	</div>

	<form on:submit={onSubmit}>
		<input
			bind:this={inputMessage}
			bind:value={newMessage}
			type="text"
			placeholder="your message"
		/>
		<Button type="submit">Send</Button>
	</form>
</div>

<style lang="scss">
	@import '../../../lib/scss/variables';

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		height: calc(100vh - 100px);

		.ready {
			width: calc(50vw - 10px);
			height: 50px;
			background: $white70;
			padding: 10px;
			box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.chat {
			display: flex;
			flex-direction: column;
			gap: 4px;
			padding: 4px;
			border-radius: 14px;
			background: $white70;
			box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
			height: 100%;
			width: 50vw;
			overflow-y: auto;
		}

		form {
			padding: 10px;
			width: calc(50vw - 10px);
			border-radius: 10px;
			background: $white70;
			display: flex;
			justify-content: space-between;
			gap: 10px;
			align-items: center;

			input {
				padding: 10px;
				border-radius: 10px;
				width: 100%;
			}
		}
	}

	.buttonModalViewRunGame {
		display: flex;
		justify-content: center;
		gap: 50px;
		margin-top: 25px;
	}
</style>
