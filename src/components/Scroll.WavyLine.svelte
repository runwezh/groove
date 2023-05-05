<script>
	import { tweened } from "svelte/motion";
	import { range } from "d3";
	import { onMount } from "svelte";
	import { quadOut } from "svelte/easing";
	import _ from "lodash";
	import { scrollyStep, direction } from "$stores/misc.js";

	export let width;

	let moving = true;
	const amplitude = tweened(150, { easing: quadOut });

	$: $scrollyStep, scrollChange();
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

	const loop = () => {
		amplitude
			.set(_.random(0, 120), { duration: _.random(400, 800) })
			.then(loop);
	};

	const scrollChange = () => {
		const straightLine =
			$scrollyStep === 2 ||
			$scrollyStep === 3 ||
			($scrollyStep === undefined && $direction === "down");
		if (!straightLine && !moving) {
			moving = true;
			amplitude.set(150, { duration: 1500 }).then(loop);
		} else if (straightLine && moving) {
			moving = false;
			amplitude.set(0, { duration: 500 });
		}
	};

	onMount(() => {
		amplitude.set(0, { duration: 1500 }).then(loop);
	});
</script>

<path d={pathD} />

<style>
	path {
		stroke: white;
		fill: none;
		stroke-width: 2px;
	}
</style>
