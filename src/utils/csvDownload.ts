import type { DSVRowArray } from 'd3';
import { csvFormat } from 'd3';

export default function csvDownload(data: DSVRowArray): string {
	const content = `data:text/csv;charset=utf-8,${csvFormat(data)}`;
	return encodeURI(content);
} 