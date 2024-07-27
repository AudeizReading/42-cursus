<script lang="ts">
	import {
		leaderBoardApi,
		type ItemLeaderBoard as ItemLeaderBoardType,
	} from '$lib/leaderBoardApi';
	import { onMount } from 'svelte';
	import ItemLeaderBoard from './ItemLeaderBoard.svelte';
	import { getNotificationsContext } from 'svelte-notifications';

	const { addNotification } = getNotificationsContext();

	let page = 1;
	const limit = 5;
	let end: boolean = false;
	let leaderBoardValue: ItemLeaderBoardType[] = [];
	let leaderBoard: HTMLElement;
	let contentLeaderBoard: HTMLElement;
	let offsetTop: number = -510;
	let loading: boolean = false;
	let open: boolean = false;

	const getChunk = async (): Promise<void> => {
		if (end) return;
		loading = true;
		try {
			const data = await leaderBoardApi(page++, limit);
			if (data.page >= data.totalPage) end = true;
			leaderBoardValue = [...leaderBoardValue, ...data.results];
		} catch {
			end = true;
			page = 1;
			addNotification({
				text: 'Fail loading leaderboard',
				position: 'top-right',
				type: 'error',
				removeAfter: 5000,
			});
		}
		loading = false;
	};

	const baseChunk = (): void => {
		const interval = setInterval(() => {
			getChunk().then(() => {
				const { scrollHeight, clientHeight } = leaderBoard;
				if (end || scrollHeight - 50 >= clientHeight) {
					clearInterval(interval);
				}
			});
		}, 100);
	};

	const reset = (): void => {
		page = 1;
		end = false;
		leaderBoardValue = [];
	};

	const handleScroll = async (): Promise<void> => {
		const { scrollTop, scrollHeight, clientHeight } = leaderBoard;
		if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 100) {
			await getChunk();
		}
	};

	onMount(() => {
		leaderBoard.addEventListener('scroll', handleScroll);
		const interval = setInterval(() => {
			offsetTop = contentLeaderBoard.offsetTop;
		}, 100);

		return (): void => {
			leaderBoard.removeEventListener('scroll', () => {});
			clearInterval(interval);
		};
	});

	$: if (offsetTop > -450 && !open) {
		open = true;
		baseChunk();
	}

	$: if (offsetTop == -510 && open) {
		open = false;
		reset();
		leaderBoardValue = leaderBoardValue;
	}
</script>

<div class="content" bind:this={contentLeaderBoard}>
	<div class="leaderBoard" bind:this={leaderBoard}>
		{#each leaderBoardValue as item, index}
			<ItemLeaderBoard {index} {item} />
		{/each}
		{#if loading}
			<p>Loading...</p>
		{/if}
		{#if end && leaderBoardValue.length == 0}
			<p>LeaderBoard is empty</p>
		{/if}
	</div>
	<p>LeaderBoard</p>
</div>

<style lang="scss">
	@import '../../lib/scss/variables';

	.content {
		position: fixed;
		top: -510px;
		left: 50%;
		transform: translateX(-50%);
		background: $background;
		transition: top 1s;
		z-index: 99;
		width: 250px;
		padding: 10px;
		border-radius: 0 0 10px 10px;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

		> p {
			color: $white2;
			text-align: center;
			padding: 10px;
		}

		&:hover {
			top: 0;
			transition: top 1s;
		}

		.leaderBoard {
			height: 500px;
			overflow-y: auto;
			overflow-x: hidden;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10px;

			> p {
				display: flex;
				align-items: center;
				justify-content: center;
				color: $white2;
			}
		}
	}
</style>
