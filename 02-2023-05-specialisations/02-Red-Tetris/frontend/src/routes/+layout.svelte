<script lang="ts">
	import '$lib/scss/variables.scss';
	import '$lib/scss/app.scss';
	import LeaderBoard from '$lib/leaderBoard/LeaderBoard.svelte';
	import Notifications from 'svelte-notifications';
</script>

<Notifications zIndex="100">
	<LeaderBoard />
	<slot />
</Notifications>
