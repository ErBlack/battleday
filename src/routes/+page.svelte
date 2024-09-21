<script>
	import './styles.css';
	import Invitation from '../ui/invitation/invitation.svelte';

	const start = new Date('2024-10-12T16:00:00Z');
	const easter = new Date('2024-10-04T10:00:00Z');
</script>

<main>
	<div class="content">
		<h1>Battleday</h1>
		<Invitation {start} {easter} />
	</div>
</main>

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
	main {
		height: 100%;
		display: grid;
		grid-template-rows: max-content 1fr;
	}

	.content {
		margin-left: calc(round(100vw / 2, var(--cell-size)) - var(--content-width) / 2);
		width: var(--content-width);
	}

	@media (max-width: 450px) {
		.content {
			margin-left: var(--cell-size);
		}
	}
</style>
