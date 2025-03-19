export default function mapToArray<K, V>(map: Map<K, V>): Array<{ key: K; value: V }> {
	return Array.from(map, ([key, value]) => ({ key, value }));
} 