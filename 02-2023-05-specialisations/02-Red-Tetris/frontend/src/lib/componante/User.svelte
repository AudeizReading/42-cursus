<script lang="ts">
	import ImageUser from '$lib/componante/ImageUser.svelte';
	import type Player from '$lib/interfaces/Player.interface';
	import { sessionID } from '$lib/store';

	export let user: Player;
	export let master = false;
</script>

<div class:master>
	<ImageUser username={user.username} />
	<p>{user.sessionID == $sessionID ? 'You' : user.username}</p>
</div>

<style lang="scss">
	@import '../../lib/scss/variables';

	.master {
		background: $orange;
	}

	div {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: $white70;
		padding: 10px 20px;
		border-radius: 10px;

		p {
			color: $black;
		}
	}
</style>
