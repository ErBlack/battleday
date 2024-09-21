<script>
	import Timer from './timer.svelte';
	import Links from './links.svelte';

	/**
	 * @type Date
	 */
	export let start;
	/**
	 * @type Date
	 */
	export let easter;
</script>

<p class="text">I invite you to my birthday!</p>
<p class="text">
	Come on october {start.getDate()} at {start.getHours()}:{String(start.getMinutes()).padStart(
		2,
		'0'
	)} in Belgrade at
	<a href="https://yandex.ru/maps/-/CCUZIMBlkA"> Rajićeva 3 apt 2a</a>
</p>
<p class="text">Celebration <Timer {start} waitIcon="starts in" finishedIcon="in progress" /></p>

<p class="text">
	Easter egg hunt <Timer start={easter} waitIcon="starts in" finishedIcon="has begun" showSeconds />
</p>
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
