<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { username, sessionID } from '$lib/store';
	import { io } from '$lib/socket';
	import Modal from '$lib/componante/Modal.svelte';
	import Room from './Room.svelte';
	import { goto } from '$app/navigation';
	import type RoomChange from '$lib/interfaces/RoomChange.interface';
	import type RoomType from '$lib/interfaces/Room.interface';
	import Button from '$lib/componante/Button.svelte';
	import type { RoomOpened } from '$lib/interfaces/RoomOpened.interface';
	import type { RoomClosed } from '$lib/interfaces/RoomClosed.interface';

	let rooms: RoomType[] = [];
	let myRooms: RoomType[] = [];
	let showModal = false;
	let roomName: string = '';
	let modalInput: HTMLElement;

	const resetUsername = (): void => {
		username.set('');
		sessionID.set('');
	};

	onMount(() => {
		io.emit('getRooms');
		io.emit('getRoomsPlayer');
		io.on('getRooms', (data: RoomType[]) => {
			rooms = data;
		});
		io.on('getRoomsPlayer', (data: RoomType[]) => {
			myRooms = data;
		});
		io.on('roomOpened', (data: RoomOpened) => {
			rooms = [...rooms, data.room];
		});
		io.on('roomClosed', (data: RoomClosed) => {
			rooms = rooms.filter((x) => {
				if (x.name == data.room.name) return false;
				return true;
			});
			myRooms = myRooms.filter((x) => {
				if (x.name == data.room.name) return false;
				return true;
			});
		});
		io.on('roomChange', (data: RoomChange) => {
			switch (data.reason) {
				case 'player incoming':
					rooms[rooms.findIndex((x) => x.name == data.room.name)] = data.room;
					myRooms[myRooms.findIndex((x) => x.name == data.room.name)] = data.room;
					rooms = rooms;
					myRooms = myRooms;
					break;
				case 'player outgoing':
					rooms[rooms.findIndex((x) => x.name == data.room.name)] = data.room;
					myRooms[myRooms.findIndex((x) => x.name == data.room.name)] = data.room;
					rooms = rooms;
					myRooms = myRooms;
					break;
			}
		});
	});

	onDestroy(() => {
		io.off('getRooms');
		io.off('getRoomsPlayer');
		io.off('roomOpened');
		io.off('roomClosed');
		io.off('roomChange');
	});

	const createRoom = (): void => {
		io.emit('createRoom', roomName);
		io.emit('joinRoom', roomName);
		goto(`/#${roomName}[${$username}]`);
		roomName = '';
		showModal = false;
	};

	const modalView = (): void => {
		showModal = !showModal;
	};

	const updateRooms = (): void => {
		rooms = rooms.filter((x) => {
			for (const e of myRooms) {
				if (x.name == e.name) return false;
			}
			return true;
		});
	};

	$: if (showModal && modalInput) {
		modalInput.focus();
	}

	$: if (rooms) {
		for (const e of rooms) {
			for (const p of e.players) {
				if (p.sessionID == $sessionID) {
					myRooms.push(e);
					break;
				}
			}
		}
		updateRooms();
	}

	$: if (myRooms) {
		updateRooms();
	}
</script>

<div class="main">
	<p>My Rooms</p>
	<div class="rooms">
		{#each myRooms as room}
			<Room {room} />
		{/each}
	</div>
	<p>Rooms</p>
	<div class="rooms">
		{#each rooms as room}
			<Room {room} />
		{/each}
	</div>
	<Button on:click={modalView}>Create a room</Button>
	<Button class="resetUsername" on:click={resetUsername}>Reset your username</Button>
</div>

<Modal bind:show={showModal}>
	<form on:submit={createRoom}>
		<p>Room Name:</p>
		<input type="text" bind:this={modalInput} bind:value={roomName} />
		<Button type="submit">send</Button>
	</form>
</Modal>

<style lang="scss">
	@import '../../lib/scss/variables';

	.main {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 100vh;
		gap: 10px;

		p {
			color: $white2;
		}

		:global(.resetUsername) {
			position: absolute;
			top: 10px;
			right: 10px;
		}

		.rooms {
			display: flex;
			flex-direction: column;
		}
	}
</style>
