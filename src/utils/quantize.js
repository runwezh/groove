const determineQuantizeValue = (beats) => {
	const beatValues = [1 / 8, 1 / 4, 1 / 2, 1];

	const smallestDistanceBetweenTwoBeats = beats.reduce((current, acc) => {
		const distances = beats.map((beat) => Math.abs(beat - current));
		const minDistance = Math.min(...distances);
		return minDistance < acc ? minDistance : acc;
	}, 0);

	const distancesToQuantizeValues = beatValues.map((value) =>
		Math.abs(value - smallestDistanceBetweenTwoBeats)
	);
	const quantizeValue =
		beatValues[
			distancesToQuantizeValues.indexOf(Math.min(...distancesToQuantizeValues))
		];
	return quantizeValue;

	// const secondValue = beats[1];

	// if (!secondValue) return 1;

	// const distances = beatValues.map((value) => Math.abs(value - secondValue));
	// return beatValues[distances.indexOf(Math.min(...distances))];
};

const quantize = (beats) => {
	const quantizeValue = determineQuantizeValue(beats);

	return beats.map((beat) => Math.round(beat / quantizeValue) * quantizeValue);
};

export default quantize;
