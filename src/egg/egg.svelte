<script>
	import { onDestroy, onMount } from 'svelte';
	import { gameActivated, gameOpen } from '../game/store.js';

	const threshold = 25;

	/**
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @returns {{ x: number, y: number }}
	 */
	const findMidpoint = (x1, y1, x2, y2) => {
		return { x: Math.round((x1 + x2) / 2), y: Math.round((y1 + y2) / 2) };
	};

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @returns {boolean}
	 */
	const inRect = (x, y, x1, y1, x2, y2) => {
		return x >= x1 && x <= x2 && y >= y1 && y <= y2;
	};

	/**
	 * @type {HTMLDivElement}
	 */
	let field;
	let start = false;
	/**
	 * @type {number}
	 */
	let viewport;

	/**
	 * @type {[number, number, number, number][]}
	 */
	let correctRect;

	/**
	 * @type {boolean|null}
	 */
	let prevWasCorrect;

	/**
	 * @type {number}
	 */
	let targetWidth;

	/**
	 * @type {number}
	 */
	let targetHeight;

	/**
	 * @type {{x: number, y: number}[][]}
	 */
	let correctLines = [];

	/**
	 * @param {{x: number, y: number}} coordinates
	 */
	const addToCorrectLines = (coordinates) => {
		if (!correctLines.length) return;

		correctLines = [
			...correctLines.slice(0, -1),
			[...correctLines[correctLines.length - 1], coordinates]
		];
	};

	/**
	 * @type {{x: number, y: number}[][]}
	 */
	let incorrectLines = [];

	/**
	 * @param {{x: number, y: number}} coordinates
	 */
	const addToIncorrectLines = (coordinates) => {
		if (!incorrectLines.length) return;

		incorrectLines = [
			...incorrectLines.slice(0, -1),
			[...incorrectLines[incorrectLines.length - 1], coordinates]
		];
	};

	/**
	 * @type {null|{x: number, y: number}}
	 */
	let prevPoint = null;

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	const isCorrect = (x, y) => {
		return correctRect.some(([x1, y1, x2, y2]) => inRect(x, y, x1, y1, x2, y2));
	};

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	const handleCoordinates = (x, y) => {
		const correct = isCorrect(x, y);

		if (prevWasCorrect !== correct) {
			if (prevPoint) {
				if (correct) {
					addToIncorrectLines(findMidpoint(prevPoint.x, prevPoint.y, x, y));
				} else {
					addToCorrectLines(findMidpoint(prevPoint.x, prevPoint.y, x, y));
				}
			}

			if (correct) {
				correctLines.push([]);
			} else {
				incorrectLines.push([]);
			}

			if (prevPoint) {
				if (correct) {
					addToCorrectLines(findMidpoint(prevPoint.x, prevPoint.y, x, y));
				} else {
					addToIncorrectLines(findMidpoint(prevPoint.x, prevPoint.y, x, y));
				}
			}

			prevWasCorrect = correct;
		}

		prevPoint = { x, y };

		if (correct) {
			addToCorrectLines({ x, y });
		} else {
			addToIncorrectLines({ x, y });
		}
	};

	/**
	 * @param {Array<{x: number, y: number}>} coordinates
	 * @returns {string}
	 */
	const coordinatesToD = (coordinates) =>
		coordinates
			.map(({ x, y }, index) => {
				if (index === 0) {
					return `M ${x} ${y}`;
				}

				return `L ${x} ${y}`;
			})
			.join(' ');

	const init = () => {
		const { x, y, width, height } = field.getBoundingClientRect();

		correctRect = [
			[x - threshold, y - threshold, x + threshold, y + height + threshold],
			[x - threshold, y - threshold, x + width + threshold, y + threshold],
			[x + width - threshold, y - threshold, x + width + threshold, y + height + threshold],
			[x - threshold, y + height - threshold, x + width + threshold, y + height + threshold]
		];

		targetWidth = width;
		targetHeight = height;

		prevWasCorrect = null;

		viewport = window.innerWidth;
		start = true;

		correctLines = [];
		incorrectLines = [];
	};

	const clear = () => {
		start = false;
		prevPoint = null;

		if (correctLines.length !== 1) return;
		if (incorrectLines.length > 0) return;

		const correctLine = document.querySelector('.correct');

		if (!correctLine) return;

		const { width, height } = correctLine.getBoundingClientRect();

		if (Math.abs(targetWidth - width) > threshold * 2) return;
		if (Math.abs(targetHeight - height) > threshold * 2) return;

		const firstPoint = correctLines[0][0];
		const lastPoint = correctLines[0][correctLines[0].length - 1];

		if (Math.abs(firstPoint.x - lastPoint.x) > threshold) return;
		if (Math.abs(firstPoint.y - lastPoint.y) > threshold) return;

		gameActivated.set(true);
		gameOpen.set(true);
	};

	/**
	 * @param {MouseEvent} event
	 */
	const onMouseDown = ({ clientX, clientY }) => {
		init();

		handleCoordinates(clientX, clientY);
	};

	/**
	 * @param {MouseEvent} event
	 */
	const onMouseMove = ({ clientX, clientY }) => {
		if (!start) {
			return;
		}

		handleCoordinates(clientX, clientY);
	};

	const onMouseUp = () => {
		clear();
	};

	/**
	 * @param {TouchEvent} event
	 */
	const onTouchStart = ({ touches }) => {
		init();

		handleCoordinates(touches[0].clientX, touches[0].clientY);
	};

	/**
	 * @param {TouchEvent} event
	 */
	const onTouchMove = ({ touches, preventDefault }) => {
		if (!start) {
			return;
		}

		handleCoordinates(touches[0].clientX, touches[0].clientY);
	};

	const onTouchEnd = () => {
		clear();
	};

	const onWindowsResize = () => {
		const multiplier = window.innerWidth / viewport;

		correctLines = correctLines.map((line) => {
			return line.map(({ x, y }) => ({
				x: x * multiplier,
				y: y * multiplier
			}));
		}, []);

		viewport = window.innerWidth;
	};

	if (typeof window !== 'undefined') {
		onMount(() => {
			document.body.style.setProperty('overscroll-behavior', 'none');
			/**
			 * @type {HTMLElement | null}
			 */
			const content = document.querySelector('.content');
			if (content) {
				content.style.setProperty('touch-action', 'none');
			}
			window.addEventListener('resize', onWindowsResize);
			window.addEventListener('mousedown', onMouseDown);
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
			window.addEventListener('touchstart', onTouchStart);
			window.addEventListener('touchmove', onTouchMove);
			window.addEventListener('touchend', onTouchEnd);
		});

		onDestroy(() => {
			document.body.removeAttribute('style');
			/**
			 * @type {HTMLElement | null}
			 */
			const content = document.querySelector('.content');
			if (content) {
				content.removeAttribute('style');
			}

			window.removeEventListener('resize', onWindowsResize);
			window.removeEventListener('mousedown', onMouseDown);
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
			window.removeEventListener('touchstart', onTouchStart);
			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('touchend', onTouchEnd);
		});
	}
</script>

<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
	{#each correctLines as line}
		<path class="correct" d={coordinatesToD(line)} />
	{/each}
	{#each incorrectLines as line}
		<path class="incorrect" class:start d={coordinatesToD(line)} />
	{/each}
</svg>
<div bind:this={field} />

<style>
	svg {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		stroke-width: calc(max(var(--cell-size) / 12, 2px));
		z-index: -1;
	}

	div {
		position: absolute;
		z-index: -1;
		width: calc(var(--cell-size) * 10);
		height: calc(var(--cell-size) * 10);
		left: calc(round(100vw / 2, var(--cell-size)) - (var(--cell-size) * 5));
		top: calc(var(--cell-size) * 4);
	}

	.incorrect:not(.start) {
		animation: fadeout 4s 0.5s ease-in forwards;
	}

	@keyframes fadeout {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			stroke-width: 0;
		}
	}
</style>
