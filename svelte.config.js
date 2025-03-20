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
		adapter: adapterStatic(),
		paths: {
			base
		},
		alias: {
			'$lib': 'src',
			'$actions': 'src/actions',
			'$components': 'src/components',
			'$data': 'src/data',
			'$routes': 'src/routes',
			'$stores': 'src/stores',
			'$styles': 'src/styles',
			'$svg': 'src/svg',
			'$utils': 'src/utils'
		},
		prerender: {
			handleHttpError: ({ path, referrer, message, status }) => {
				// 忽略所有 404 错误
				if (status === 404) {
					console.warn(`忽略 404 错误: ${path}`);
					return;
				}
				
				// 其他错误正常处理
				console.warn(`${path} referred from ${referrer} 错误: ${message}`);
				throw new Error(message);
			},
			handleMissingId: ({ id, path, referrer }) => {
				// 忽略所有丢失的 ID 错误
				console.warn(`忽略丢失的 ID "${id}" 错误: ${path}`);
				return;
			}
		}
	},
};

export default config;