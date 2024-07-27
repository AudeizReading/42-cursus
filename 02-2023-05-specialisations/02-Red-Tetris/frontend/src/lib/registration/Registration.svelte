<script lang="ts">
	import Button from '$lib/componante/Button.svelte';
	import { username } from '$lib/store';

	let error = false;
	let errorMsg: string = '';
	let valueForm: string;

	const onSubmit = (): void => {
		error = true;
		const usernameRegExp: RegExp = /^[a-zA-Z0-9]{3,}$/;
		if (!usernameRegExp.test(valueForm))
			errorMsg = 'Your username is not valid: min 3 char and a-z A-Z 0-9 only';
		else {
			username.set(valueForm);
			valueForm = '';
		}
	};

	$: if (valueForm?.length == 0) error = false;
</script>

<div>
	<h1>Choose your username</h1>
	<form on:submit={onSubmit}>
		{#if error}
			<p class:error>{errorMsg}</p>
		{/if}
		<input bind:value={valueForm} class:error placeholder="username" />
		<Button type="submit">Enter in Red Tetris</Button>
	</form>
</div>

<style lang="scss">
	@import '../../lib/scss/variables';

	p {
		width: 100%;
		&.error {
			color: $red;
		}
	}

	div {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		min-height: 100vh;
		gap: 20px;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 300px;
		gap: 10px;

		input {
			border: none;
			background: $white05;
			color: $white2;
			padding: 10px;
			border-radius: 50px;
			width: 100%;

			&.error {
				border: 1px solid $red;
			}

			&:focus {
				outline: none;
			}
		}
	}

	h1 {
		color: $white2;
	}
</style>
