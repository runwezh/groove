/**
 * 加载 JSON 文件
 * @param {string} path - JSON 文件路径
 * @returns {Promise<unknown>} - 解析后的 JSON 对象
 */
export async function loadJson<T = unknown>(path: string): Promise<T> {
	try {
		const response = await fetch(path);
		if (!response.ok) {
			throw new Error(`HTTP 错误! 状态: ${response.status}`);
		}
		return await response.json() as T;
	} catch (error) {
		console.error('加载 JSON 文件失败:', error);
		throw error;
	}
} 