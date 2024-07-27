<script lang="ts">
	import { goto } from '$app/navigation';
	import { sessionID, username } from '$lib/store';
	import type RoomType from '$lib/interfaces/Room.interface';

	export let room: RoomType;

	const gotoChannel = (): void => {
		goto(`/#${room.name}[${$username}]`);
	};
</script>

<span>
	{#if room.leader.sessionID == $sessionID}
		<img src="/img/king.png" alt="king img" loading="lazy" />
	{/if}
	<button on:click={gotoChannel}>
		{room.name.replaceAll('%20', ' ')}
		{room.totalPlayers}
		{room.totalPlayers <= 1 ? 'player' : 'players'}
	</button>
	{#if room.leader.sessionID == $sessionID}
		<img src="/img/king.png" alt="king img" loading="lazy" />
	{/if}
</span>

<style lang="scss">
	@import '../../lib/scss/variables';

	span {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;

		button {
			background: none;
			border: none;
			color: $white2;
			font-size: 15px;
		}

		img {
			width: 20px;
		}
	}
</style>
