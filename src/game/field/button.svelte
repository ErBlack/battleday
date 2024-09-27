<button on:click {...$$props}><slot /></button>

<style>
	button {
		height: calc(var(--cell-size) * 2);
		line-height: calc(var(--cell-size) * 2);
		border-radius: calc(var(--cell-size) / 4);
		color: inherit;
		font: inherit;
		border: solid calc(max(var(--cell-size) / 12, 2px)) currentColor;
		padding: 0;
		margin: 0;
		text-align: center;
		background: none;
		text-align: center;
		font-size: var(--cell-size);
		font-weight: 320;
		font-variation-settings:
			'BNCE' 20,
			'INFM' 40,
			'SPAC' 0;
		transition:
			font-variation-settings 0.1s ease-in,
			transform 0.1s ease-in;
	}

	button:not(:disabled):hover {
		color: var(--color-link);
	}

	button:not(:disabled):active {
		transform: scale(0.99) rotate(3deg);
		font-variation-settings:
			'BNCE' 40,
			'INFM' 100,
			'SPAC' 50;
	}

	button:disabled {
		border-style: dashed;
		text-decoration: line-through;
	}
</style>
