<script lang="ts">
	const lines: string[] = [];
	const columns: string[] = [];
	for (let i = 0; i <= 20; i++) lines.push('line');
	for (let i = 0; i <= 10; i++) columns.push('column');
</script>

<div class="grid">
	<div class="lines">
		{#each lines as line}
			<div class={line} />
		{/each}
	</div>
	<div class="columns">
		{#each columns as column}
			<div class={column} />
		{/each}
	</div>
</div>

<style lang="scss">
	@import '../../lib/scss/variables';

	.grid {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: $white2;

		.lines {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: calc(100% + 4px);
			width: 100%;
			position: absolute;
			top: -2px;
			left: 0;

			.line {
				border: 1px solid $black;
			}
		}

		.columns {
			display: flex;
			justify-content: space-between;
			width: calc(100% + 4px);
			height: 100%;
			position: absolute;
			top: 0;
			left: -2px;

			.column {
				border: 1px solid $black;
			}
		}
	}
</style>
