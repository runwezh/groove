/**
 * 保存 JSON 数据到文件
 * @param {Object} data - 要保存的 JSON 数据
 * @param {string} filename - 文件名
 * @returns {Promise<boolean>} - 保存是否成功
 */
export async function saveJson(data, filename = 'copy.json') {
  try {
    // 在实际应用中，这里应该调用后端 API 来保存文件
    // 由于浏览器安全限制，前端无法直接写入文件系统
    // 这里我们模拟一个保存操作，实际上是下载文件
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // 在实际应用中，这里应该返回后端 API 的响应
    return true;
  } catch (error) {
    console.error('保存 JSON 文件失败:', error);
    return false;
  }
}