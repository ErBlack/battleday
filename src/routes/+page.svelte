<script>
	import './styles.css';
	import { easterAvailable } from './init.js';
	import Invitation from '../ui/invitation/invitation.svelte';
	import Game from '../game/game.svelte';
	import { gameOpen } from '../game/store.js';
	import Result from '../game/result/result.svelte';
	import Egg from '../egg/egg.svelte';
</script>

{#if !$gameOpen}
	<main class="content">
		<h1>Battleday</h1>

		<Invitation />
	</main>
	{#if $easterAvailable}
		<Egg />
	{/if}
{:else}
	<Game />
{/if}

<Result />

<style>
	h1 {
		font-size: calc(var(--cell-size) * 2);
		line-height: calc(var(--cell-size) * 2);
		margin: var(--cell-size) 0;
		transform: translateY(calc(var(--cell-size) * 0.22));
		font-variation-settings:
			'BNCE' 5,
			'INFM' 100,
			'SPAC' 50;
		font-weight: 415;
	}

	.content {
		margin-left: calc(
			round(100vw / 2, var(--cell-size)) - (var(--content-width) / 2) - var(--cell-size)
		);
		margin-bottom: var(--cell-size);
		padding: 0 var(--cell-size);
		width: var(--content-width);
	}
</style>
