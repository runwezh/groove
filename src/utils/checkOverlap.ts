interface CheckOverlapParams {
	elements: HTMLElement[];
	reverse?: boolean;
}

const isOverlapping = (nodes: HTMLElement[]): boolean => {
	const root = nodes[0];
	const { top, left, right, bottom } = root.getBoundingClientRect();
	const a = [left, top, right, bottom];
	const matches = nodes.slice(1).find((node) => {
		const r = node.getBoundingClientRect();
		const b = [r.left, r.top, r.right, r.bottom];
		return intersects(a, b);
	});

	return !!matches;
};

function intersects(a: number[], b: number[]): boolean {
	return !(
		a[2] < b[0] || // a is left of b
		a[0] > b[2] || // a is right of b
		a[3] < b[1] || // a is above b
		a[1] > b[3]    // a is below b
	);
}

export default function checkOverlap({ elements, reverse = false }: CheckOverlapParams): void {
	const labels = [...elements];
	if (reverse) labels.reverse();
	labels.forEach((el, i) => {
		const order = labels.length - i - 1;
		const overlap = isOverlapping(labels.slice(i));
		if (overlap) el.classList.add("is-overlap");
	});
} 