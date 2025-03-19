import { csvParse, DSVRowArray } from "d3";

export default async function loadCsv<T extends object = object>(url: string): Promise<DSVRowArray<T>> {
	const response = await fetch(url);
	const csv = await response.text();
	const data = csvParse<T>(csv);
	return data;
} 