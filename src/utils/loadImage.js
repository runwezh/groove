export default function loadImage(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();

		// setTimeout(() => {
		img.onload = () => resolve(img);
		img.onerror = () => reject(`error loading ${url}`);
		img.src = url;
		// }, 3000);
	});
}
