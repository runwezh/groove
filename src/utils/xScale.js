/**
 * 计算时间在进度条上的位置百分比
 * @param {number} time - 当前时间（秒）
 * @param {number} duration - 总时长（秒）
 * @returns {number} - 百分比值（0-100）
 */
export function xScale(time, duration = 0) {
  if (!duration) return 0;
  return (time / duration) * 100;
} 