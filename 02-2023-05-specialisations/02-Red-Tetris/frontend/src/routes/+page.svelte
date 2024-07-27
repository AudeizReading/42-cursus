<script lang="ts">
	import { page } from '$app/stores';
	import ListRoom from '$lib/listRoom/ListRoom.svelte';
	import Registration from '$lib/registration/Registration.svelte';
	import WaitingRoom from '$lib/waitingRoom/WaitingRoom.svelte';
	import { sessionID, username } from '$lib/store';
	import { io } from '$lib/socket';
	import { onDestroy, onMount } from 'svelte';
	import type Player from '$lib/interfaces/Player.interface';
	import { goto } from '$app/navigation';
	import { getNotificationsContext } from 'svelte-notifications';

	const { addNotification } = getNotificationsContext();

	const hashFormat: RegExp = /^#[\sa-zA-Z0-9]{3,}\[[a-zA-Z0-9]{3,}\]$/;
	const hashFormatRoom: RegExp = /^#[\sa-zA-Z0-9]{3,}$/;

	onMount(() => {
		io.on('connect', () => {
			addNotification({
				text: 'Welcome to red tetris',
				position: 'top-right',
				type: 'success',
				removeAfter: 5000,
			});
		});
		io.on('disconnect', () => {
			addNotification({
				text: 'Good bye red tetris',
				position: 'top-right',
				type: 'success',
				removeAfter: 1000,
			});
		});
		io.on('connect_error', () => {
			addNotification({
				text: 'Error connection socket',
				position: 'top-right',
				type: 'error',
				removeAfter: 1000,
			});
			sessionID.set('');
			username.set('');
			io.close();
			goto('/');
		});
		io.on('join', (data: Player) => {
			sessionID.set(data.sessionID);
			username.set(data.username);
		});
		io.on('error', (data: string) => {
			addNotification({
				text: data,
				position: 'top-right',
				type: 'error',
				removeAfter: 5000,
			});
		});

		if (
			$username != '' &&
			!hashFormat.test($page.url.hash.replaceAll('%20', ' ')) &&
			hashFormatRoom.test($page.url.hash.replaceAll('%20', ' '))
		) {
			goto(`/${$page.url.hash}[${$username}]`);
		}
	});

	onDestroy(() => {
		io.close();
	});

	$: if ($username == '' && $sessionID == '' && io.active) {
		io.close();
	}

	$: if (($username != '' || $sessionID != '') && !io.active) {
		io.auth = $sessionID != '' ? { sessionID: $sessionID } : { username: $username };
		io.connect();
	}
</script>

<svelte:head>
	{#if hashFormat.test($page.url.hash.replaceAll('%20', ' '))}
		<title>WaitingRoom | Red Tetris</title>
	{:else if !$username}
		<title>Registration | Red Tetris</title>
	{:else if $username}
		<title>ListRoom | Red Tetris</title>
	{/if}
</svelte:head>

{#if hashFormat.test($page.url.hash.replaceAll('%20', ' '))}
	<WaitingRoom />
{:else if !$username}
	<Registration />
{:else if $username}
	<ListRoom />
{/if}
