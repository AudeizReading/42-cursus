<script lang="ts">
	export let type: 'arrow' | 'space' | 'default' = 'default';
	export let value: string = '';
	export let pressed = false;
</script>

<div class="key {type}" class:pressed>
	<span>{value}</span>
</div>

<style lang="scss">
	.default {
		width: 3.3em;
		height: 3.3em;
	}

	.arrow {
		height: 1.8em;
		width: 3.3em;
	}

	.space {
		height: 3.6em;
		width: 18em;
	}

	.key {
		margin-top: 1.7em;
		line-height: 0.5em;
		background: #333;
		color: #eee;
		border-radius: 0.3em;
		margin: 0.2em;
		padding: 0.2em;
		border: 1px solid #444;
		box-shadow: 0 0.2em 0 0.05em #222;
		border-bottom-color: #555;
		display: flex;
		align-items: center;
		justify-content: center;

		span {
			font-size: 0.5em;
			line-height: 3em;
			font-family: sans-serif;
			text-align: center;
			font-size: 14px;
		}
	}

	.pressed {
		background: #2a2a2a;
		color: #aaa;
		position: relative;
		top: 0.2em;
		box-shadow: 0 0 0 0.05em black;
	}
</style>
