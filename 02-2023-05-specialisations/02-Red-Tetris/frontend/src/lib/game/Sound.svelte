<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { music, musicLevel, effectLevel, effectMute, musicMute } from '$lib/store';

	onMount(() => {
		const createMusics: { [key: string]: HTMLAudioElement } = {
			soundBR: new Audio('/sounds/Korobeiniki-BR-01.mp3'),
			soundCN: new Audio('/sounds/Korobeiniki-CN-01.mp3'),
			soundFVR: new Audio('/sounds/Korobeiniki-FVR-01.mp3'),
		};

		const createEffects: { [key: string]: HTMLAudioElement } = {
			backToBackTetris: new Audio('/sounds/backToBackTetris.mp3'),
			blockout: new Audio('/sounds/blockout.mp3'),
			collapse: new Audio('/sounds/collapse.mp3'),
			hardDrop: new Audio('/sounds/hardDrop.mp3'),
			hold: new Audio('/sounds/hold.mp3'),
			inputFailed: new Audio('/sounds/inputFailed.mp3'),
			levelUp: new Audio('/sounds/levelUp.mp3'),
			lineClear: new Audio('/sounds/lineClear.mp3'),
			lock: new Audio('/sounds/lock.mp3'),
			move: new Audio('/sounds/move.mp3'),
			rotate: new Audio('/sounds/rotate.mp3'),
			tetris: new Audio('/sounds/tetris.mp3'),
			win: new Audio('/sounds/win.mp3'),
		};

		musics = createMusics;
		effects = createEffects;

		Object.keys(musics).forEach((music) => {
			musics[music].loop = true;
		});
		Object.keys(effects).forEach((effect) => {
			effects[effect].volume = $effectMute ? 0 : $effectLevel;
		});

		musics[$music].volume = $musicMute ? 0 : $musicLevel;
		musics[$music].play();
	});

	onDestroy(() => {
		if (typeof musics != 'undefined') {
			Object.keys(musics).forEach((music) => {
				musics[music].currentTime = 0;
				musics[music].pause();
			});
		}
		if (typeof effects != 'undefined') {
			Object.keys(effects).forEach((effect) => {
				effects[effect].currentTime = 0;
				effects[effect].pause();
			});
		}
	});

	let musics: { [key: string]: HTMLAudioElement };
	export let effects: { [key: string]: HTMLAudioElement };

	let openSettings = false;

	let valueMusic = $musicLevel;
	let valueEffect = $effectLevel;
	let valueMusicSelect = $music;

	const closeMenuSettings = (): void => {
		openSettings = false;
	};

	const toggleMenuSettings = (): void => {
		openSettings = !openSettings;
	};

	const muteMusic = (): void => {
		musicMute.set(!$musicMute);
	};

	const muteEffect = (): void => {
		effectMute.set(!$effectMute);
	};

	$: if (valueMusic) musicLevel.set(valueMusic);
	$: if (valueEffect) effectLevel.set(valueEffect);
	$: if (valueMusicSelect) {
		if (typeof musics != 'undefined' && valueMusicSelect != $music) {
			musics[$music].pause();
			musics[$music].currentTime = 0;
			musics[valueMusicSelect].volume = $musicMute ? 0 : $musicLevel;
			musics[valueMusicSelect].play();
		}
		music.set(valueMusicSelect);
	}
	$: if (typeof musics != 'undefined') {
		musics[$music].volume = $musicMute ? 0 : $musicLevel;
	}
	$: if (typeof effects != 'undefined') {
		Object.keys(effects).forEach((effect) => {
			effects[effect].volume = $effectMute ? 0 : $effectLevel;
		});
	}
</script>

{#if openSettings}
	<button class="background" on:click={closeMenuSettings} />
{/if}

<button id="setting" on:click={toggleMenuSettings}>
	<span class="material-symbols-outlined"> settings </span>
</button>

{#if openSettings}
	<div class="settings">
		<div class="setting">
			<p>Music</p>
			<form>
				<select bind:value={valueMusicSelect}>
					{#each Object.keys(musics) as music}
						<option value={music}>{music}</option>
					{/each}
				</select>
				<input type="range" bind:value={valueMusic} min="0.1" max="1" step="0.1" />
				<button on:click={muteMusic}>
					{#if !$musicMute}
						{#if $musicLevel > 0.5}
							<span class="material-symbols-outlined"> volume_up </span>
						{:else}
							<span class="material-symbols-outlined"> volume_down </span>
						{/if}
					{:else}
						<span class="material-symbols-outlined"> volume_off </span>
					{/if}
				</button>
			</form>
		</div>
		<div class="setting">
			<p>Sound Effects</p>
			<form>
				<input type="range" bind:value={valueEffect} min="0.1" max="1" step="0.1" />
				<button on:click={muteEffect}>
					{#if !$effectMute}
						{#if $effectLevel > 0.5}
							<span class="material-symbols-outlined"> volume_up </span>
						{:else}
							<span class="material-symbols-outlined"> volume_down </span>
						{/if}
					{:else}
						<span class="material-symbols-outlined"> volume_off </span>
					{/if}
				</button>
			</form>
		</div>
	</div>
{/if}

<style lang="scss">
	@import '../../lib/scss/variables';

	.background {
		border: none;
		background: transparent;
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.settings {
		position: fixed;
		top: 70px;
		right: 15px;
		box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
		padding: 15px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: 2;
		background: $white2;

		.setting {
			padding: 10px;
			border-radius: 6px;
			box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;

			p {
				font-size: 20px;
				font-weight: 800;
				padding-bottom: 10px;
			}

			form {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 5px;

				button {
					border-radius: 2px;
					border: none;
					background: none;
					width: 30px;
					height: 30px;
					box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
				}
			}
		}
	}

	#setting {
		position: fixed;
		top: 10px;
		right: 10px;
		cursor: pointer;
		background: $white2;
		border: none;
		border-radius: 6px;
		width: 50px;
		height: 50px;
		overflow: hidden;
		box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			0.2s width,
			0.2s height,
			0.2s top,
			0.2s right;
		z-index: 2;

		.material-symbols-outlined {
			font-size: 30px;
			transition: 0.2s font-size;
		}

		&:hover {
			width: 45px;
			height: 45px;
			top: 12.5px;
			right: 12.5px;
			transition:
				0.2s width,
				0.2s height,
				0.2s top,
				0.2s right;

			.material-symbols-outlined {
				font-size: 35px;
				transition: 0.2s font-size;
			}
		}
	}
</style>
