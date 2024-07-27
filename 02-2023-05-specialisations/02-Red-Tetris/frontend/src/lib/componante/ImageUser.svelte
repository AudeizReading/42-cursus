<script lang="ts">
	export let username: string;
</script>

<div>
	<p>{username.slice(0, 1)}{username.slice(-1)}</p>
</div>

<style lang="scss">
	@import '../../lib/scss/variables';

	div {
		width: 50px;
		height: 50px;
		border-radius: 50px;
		background: $white2;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

		p {
			color: $black;
			font-weight: 800;
			font-size: 25px;
		}
	}
</style>
