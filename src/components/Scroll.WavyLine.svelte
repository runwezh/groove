<script>
	import { tweened } from "svelte/motion";
	import { range } from "d3";
	import { onDestroy, onMount } from "svelte";

	export let width;

	const duration = 1500;
	const yOffset = 150;
	const amplitude = tweened(150, {
		duration
	});

	$: wavelength = width;
	$: points = range(5).map((i) => {
		const x = (wavelength / 4) * i;
		const yKey = {
			0: 0,
			1: -$amplitude,
			2: 0,
			3: $amplitude,
			4: 0
		};
		const y = yKey[i];
		return [x, y];
	});
	$: pathD = pointsToPath(points);

	const line = (pointA, pointB) => {
		const lengthX = pointB[0] - pointA[0];
		const lengthY = pointB[1] - pointA[1];
		return {
			length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
			angle: Math.atan2(lengthY, lengthX)
		};
	};

	const controlPoint = (current, previous, next, reverse) => {
		const p = previous || current;
		const n = next || current;
		const smoothing = 0.2;
		const o = line(p, n);
		const angle = o.angle + (reverse ? Math.PI : 0);
		const length = o.length * smoothing;
		const x = current[0] + Math.cos(angle) * length;
		const y = current[1] + Math.sin(angle) * length;
		return [x, y];
	};

	const bezierCommand = (point, i, a) => {
		const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
		const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
		return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
	};

	const pointsToPath = (points) => {
		const d = points.reduce(
			(acc, point, i, a) =>
				i === 0
					? `M ${point[0]},${point[1]}`
					: `${acc} ${bezierCommand(point, i, a)}`,
			""
		);
		return d;
	};

	let interval;
	onMount(() => {
		interval = setInterval(() => {
			if ($amplitude > 10) {
				$amplitude = 0;
			} else {
				$amplitude = 150;
			}
		}, duration + 100);
	});
	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<g transform={`translate(0, ${yOffset})`}>
	<path d={pathD} />
</g>

<style>
	path {
		stroke: white;
		fill: none;
		stroke-width: 2px;
	}
</style>
