<script lang="ts">
	export let level: number;
	export let score: number;
</script>

<div class="level">
	<p>Level: {level}</p>
	<p>Score: {score}</p>
</div>

<style lang="scss">
	@import '../../lib/scss/variables';

	.level {
		position: fixed;
		top: 15px;
		left: 15px;
		box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
		background: $white2;
		padding: 15px;
		border-radius: 10px;
	}
</style>
