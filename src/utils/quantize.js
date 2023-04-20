const determineQuantizeValue = (beats) => {
	// const beatValues = [1 / 4, 1 / 2, 1];
	// const smallestDistanceBetweenTwoBeats = beats.reduce((current, acc) => {
	// 	const distances = beats.map((beat) => Math.abs(beat - current));
	// 	const minDistance = Math.min(...distances);
	// 	return minDistance < acc ? minDistance : acc;
	// }, 0);
	// const distancesToQuantizeValues = beatValues.map((value) =>
	// 	Math.abs(value - smallestDistanceBetweenTwoBeats)
	// );
	// const quantizeValue =
	// 	beatValues[
	// 		distancesToQuantizeValues.indexOf(Math.min(...distancesToQuantizeValues))
	// 	];
	// return quantizeValue;
};

const quantize = (beats, value = 0.5) => {
	return beats.map((beat) => Math.round(beat / value) * value);
};

export default quantize;
