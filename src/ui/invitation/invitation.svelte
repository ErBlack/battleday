<script>
	import Timer from './timer.svelte';
	import Links from './links.svelte';
	import { gameActivated, gameOpen } from '../../game/store.js';
	import Button from './button.svelte';
	import Code from '../../game/result/code.svelte';
	import { easter, start, easterAvailable } from '../../routes/init.js';
</script>

<p class="text">I invite you to my birthday!</p>
<p class="text">
	Come on october {start.getDate()} at {start.getHours()}:{String(start.getMinutes()).padStart(
		2,
		'0'
	)} in Belgrade at
	<a href="https://yandex.ru/maps/-/CCUZIMBlkA"> Rajićeva 3 apt 2a</a>
</p>

{#if $gameActivated}
	<menu>
		Game:
		<Button on:click={() => gameOpen.set(true)} size={1}>Start</Button>
		<Code />
	</menu>
{:else}
	<p class="text">
		Easter egg hunt <Timer
			start={easter}
			waitIcon="starts in"
			finishedIcon="has begun"
			showSeconds
			onEnd={() => easterAvailable.set(true)}
		/>
	</p>
{/if}

<p class="text">Celebration <Timer {start} waitIcon="starts in" finishedIcon="in progress" /></p>
<Links />

<style>
	p {
		--letters-size: 0.85;
		font-size: calc(var(--cell-size) * var(--letters-size));
		margin: var(--cell-size) 0;
		line-height: var(--cell-size);
		transform: translateY(calc(var(--cell-size) * (1 - var(--letters-size))));
		font-weight: 380;
	}

	menu {
		margin: 0 0 var(--cell-size) 0;
		padding: 0;
		display: grid;
		gap: var(--cell-size);
		grid-template-columns: calc(var(--cell-size) * 2) calc(var(--cell-size) * 2) max-content;
		--letters-size: 0.85;
		font-size: calc(var(--cell-size) * var(--letters-size));
	}

	p:nth-child(3n) {
		font-variation-settings:
			'BNCE' 20,
			'INFM' 33,
			'SPAC' 0;
	}

	p:nth-child(3n + 1) {
		font-variation-settings:
			'BNCE' 30,
			'INFM' 80,
			'SPAC' 0;
	}

	p:nth-child(3n + 2) {
		font-variation-settings:
			'BNCE' 35,
			'INFM' 42,
			'SPAC' 0;
	}
</style>
