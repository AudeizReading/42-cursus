<script lang="ts">
	import ImageUser from '$lib/componante/ImageUser.svelte';
	import type { ItemLeaderBoard } from '$lib/leaderBoardApi';

	export let item: ItemLeaderBoard;
	export let index: number;
</script>

<div
	class="item"
	class:first={index == 0}
	class:second={index == 1}
	class:three={index == 2}
	class:other={index >= 3}
>
	<div class="base">
		<p>{index + 1}</p>
		<ImageUser username={item.username} />
		<p class="username">{item.username}</p>
	</div>
	<p class="score">{item.score} pts.</p>
</div>

<style lang="scss">
	@import '../../lib/scss/variables';

	.item {
		padding: 10px 2px;
		border-radius: 40px;
		height: 50px;
		padding: 10px 20px;
		width: 80%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 15px;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

		p {
			color: $primary;
		}

		.score {
			font-size: 14px;
		}

		.base {
			display: flex;
			align-items: center;
			gap: 10px;
		}

		.username {
			max-width: 65px;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}

	.first {
		background: $yellow;
	}

	.second {
		background: $white2;
	}

	.three {
		background: $orange;
	}

	.other {
		background: #91818a;

		p {
			color: $white2;
		}
	}
</style>
