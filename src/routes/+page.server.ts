import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data: string[] = ["a", "b", "c"];
	return { data };
}; 