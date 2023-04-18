const determineQuantizeValue = (beats) => {
	const beatValues = [0.0625, 0.125, 0.25, 0.5, 1]; // possible beat values in quarter notes
	const secondValue = beats[1];

	if (!secondValue) return 1;

	const distances = beatValues.map((value) => Math.abs(value - secondValue));
	return beatValues[distances.indexOf(Math.min(...distances))];
};

const quantize = (beats) => {
	const quantizeValue = determineQuantizeValue(beats);

	return beats.map((beat) => Math.round(beat / quantizeValue) * quantizeValue);
};

export default quantize;
