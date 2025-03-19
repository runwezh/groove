/* Usage
<g out:transformSvg={{ target: "translate(50, 50)" }}>
*/

import { linear } from "svelte/easing";
import { interpolateTransformSvg } from "d3";
import type { EasingFunction } from "svelte/transition";

interface TransformParams {
	target: string;
	relative?: boolean;
	delay?: number;
	duration?: number;
	easing?: EasingFunction;
	opacity?: boolean;
}

interface TransformReturn {
	delay: number;
	duration: number;
	easing: EasingFunction;
	tick: (t: number, u: number) => void;
	css?: (t: number) => string | null;
}

export default function transform(node: SVGElement, params: TransformParams): TransformReturn {
	const a = node.getAttribute("transform") || "";
	const b = `${params.relative ? a : ""} ${params.target}`;
	const interpolator = interpolateTransformSvg(a, b);

	return {
		delay: params.delay || 0,
		duration: params.duration || 250,
		easing: params.easing || linear,
		tick: (t: number, u: number) => {
			const transform = interpolator(u);
			node.setAttribute("transform", transform);
		},
		css: (t: number) => (params.opacity ? `opacity: ${t}` : null)
	};
} 