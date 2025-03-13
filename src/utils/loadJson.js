/**
 * 加载 JSON 文件
 * @param {string} path - JSON 文件路径
 * @returns {Promise<Object>} - 解析后的 JSON 对象
 */
export async function loadJson(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('加载 JSON 文件失败:', error);
    throw error;
  }
}
