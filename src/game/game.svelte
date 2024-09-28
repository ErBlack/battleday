<script>
	import { encrypt } from '$lib/crypt.js';
	import { wait } from '$lib/wait.js';

	import Field from './field/field.svelte';

	import { Player1, Player2 } from './game.js';
	import { gameOpen, winCode, winner } from './store.js';

	let round = 0;

	const game = async () => {
		if (!Player1.ready) {
			await Player1.placeShips();
		}

		if (!Player2.ready) {
			await Player2.placeShips();
		}

		while (!Player1.failed && !Player2.failed) {
			round++;

			await Player1.attack(Player2);

			if (Player1.failed) break;

			await wait(1000);

			await Player2.attack(Player1);
		}

		winner.set(Player2.failed);

		if (Player2.failed) {
			winCode.update((value) => {
				const code = value || encrypt(String(Date.now()).slice(0, -1));

				return code;
			});
		}

		Player1.reset();
		Player2.reset();
		gameOpen.set(false);
	};

	game();
</script>

<div>
	<h2>{round === 0 ? 'Place your ships' : `Round ${round}`}</h2>
	{#if round !== 0}
		<Field field={Player1.enemyField} showAround />
	{/if}
	<Field field={Player1.personalField} />
</div>

<style>
	h2 {
		font-size: calc(var(--cell-size));
		line-height: calc(var(--cell-size));
		margin: 0 0 0 var(--cell-size);
		transform: translateY(calc(var(--cell-size) * 0.22));
		font-variation-settings:
			'BNCE' 5,
			'INFM' 100,
			'SPAC' 50;
		font-weight: 415;
	}
	div {
		display: grid;
		gap: var(--cell-size);
		margin: var(--cell-size) 0 var(--cell-size)
			calc(round(100vw / 2, var(--cell-size)) - (var(--cell-size) * 6));
	}
</style>
