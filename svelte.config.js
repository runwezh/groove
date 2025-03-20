import { readFileSync } from "fs";
import adapterStatic from "@sveltejs/adapter-static";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const { subdirectory } = JSON.parse(readFileSync("package.json", "utf8"));
const dev = process.env.NODE_ENV !== "production";
const dir = subdirectory || "";
const prefix = dir.startsWith("/") ? "" : "/";
const base = dev || !dir ? "" : `${prefix}${dir}`;

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [autoprefixer]
	},
	typescript: {
		tsconfigFile: './tsconfig.json',
		compilerOptions: {
			module: 'esnext'
		}
	}
});

const config = {
	preprocess,
	kit: {
		adapter: adapterStatic({
			fallback: 'index.html',
			assets: 'build',
			pages: 'build'
		}),
		paths: {
			base
		},
		prerender: {
			entries: ['*'],
			handleHttpError: ({ path, referrer, message }) => {
				if (message.includes('does not begin with `base`')) {
					return;
				}
				console.warn(`${path} 引用自 ${referrer}: ${message}`);
			}
		}
	},
	vitePlugin: {
		experimental: {
			inspector: { holdMode: true },
		}
	},
};

export default config;