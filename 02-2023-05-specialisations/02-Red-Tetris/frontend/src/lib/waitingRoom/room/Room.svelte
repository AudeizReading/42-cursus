<script lang="ts">
	import User from '$lib/componante/User.svelte';
	import type Player from '$lib/interfaces/Player.interface';

	export let players: Player[];
	export let master: Player;
</script>

<div class="users">
	{#each players as player}
		<User user={player} master={master?.sessionID == player?.sessionID} />
	{/each}
</div>

<style lang="scss">
	@import '../../../lib/scss/variables';

	.users {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 4px;
		border-radius: 14px;
		background: $white70;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
		height: calc(100vh - 100px);
		overflow-y: auto;
	}
</style>
