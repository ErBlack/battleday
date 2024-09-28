<script>
	import { wait } from '$lib/wait.js';
	import { Bot } from './user/bot.js';

	import Field from './field/field.svelte';
	import { RealField } from './field/real-field.js';
	import { EphemeralField } from './field/ephemeral-field.js';
	import { player1Field, player1PreviewField, player2Field, player2PreviewField } from './store.js';
	import { Player } from './user/player.js';

	const Player1 = new Player(new RealField(player1Field), new EphemeralField(player1PreviewField));
	const Player2 = new Bot(new RealField(player2Field), new EphemeralField(player2PreviewField));

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

		console.log(Player1.failed ? 'Player 2 wins!' : 'Player 1 wins!');
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
		margin: 0;
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
			calc(round(100vw / 2, var(--cell-size)) - (var(--cell-size) * 5) - var(--cell-size));
	}
</style>
