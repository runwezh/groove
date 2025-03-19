declare const __VERSION__: string;
declare const __TIMESTAMP__: string;

export default function version(): void {
	console.log("--- --- --- --- --- ---");
	console.log(`svelte-starter: ${__VERSION__}`);
	console.log(`build: ${__TIMESTAMP__}`);
	console.log("--- --- --- --- --- ---");
} 