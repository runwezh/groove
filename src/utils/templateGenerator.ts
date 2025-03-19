/**
 * 模板选项接口
 */
interface TemplateOption {
  name: string;
  id: string;
  children?: TemplateOption[];
}

/**
 * 生成模板数据
 * @param {string[]} path - 当前路径
 * @param {TemplateOption[]} options - 可用的模板选项
 * @returns {object} 生成的模板数据
 */
export function generateTemplate(path: string[], options: TemplateOption[] = defaultTemplates): any {
  // 根据路径查找当前选项
  let currentOption: TemplateOption | undefined = undefined;
  let currentOptions = options;
  
  for (const segment of path) {
    currentOption = currentOptions.find(option => option.id === segment);
    if (!currentOption || !currentOption.children) {
      break;
    }
    currentOptions = currentOption.children;
  }

  if (!currentOption) {
    return {
      title: "选择模板",
      options: options,
      template: null
    };
  }

  // 如果有子选项，返回子选项列表
  if (currentOption.children && currentOption.children.length > 0) {
    return {
      title: currentOption.name,
      options: currentOption.children,
      template: null
    };
  }

  // 生成实际模板
  return {
    title: currentOption.name,
    options: [],
    template: getTemplateContent(currentOption.id)
  };
}

/**
 * 获取模板内容
 * @param {string} templateId - 模板ID
 * @returns {object} 模板内容
 */
function getTemplateContent(templateId: string): any {
  // 这里可以根据 templateId 返回不同的模板内容
  // 示例模板
  const templates: Record<string, any> = {
    'basic': {
      beats: 4,
      notes: [
        { time: 0, duration: 1, pitch: 60 },
        { time: 1, duration: 1, pitch: 62 },
        { time: 2, duration: 1, pitch: 64 },
        { time: 3, duration: 1, pitch: 65 }
      ]
    },
    '4-4-basic': {
      beats: 4,
      notes: [
        { time: 0, duration: 1, pitch: 60 },
        { time: 1, duration: 1, pitch: 62 },
        { time: 2, duration: 1, pitch: 64 },
        { time: 3, duration: 1, pitch: 65 }
      ]
    },
    '3-4-waltz': {
      beats: 3,
      notes: [
        { time: 0, duration: 1, pitch: 60 },
        { time: 1, duration: 0.5, pitch: 64 },
        { time: 1.5, duration: 0.5, pitch: 67 },
        { time: 2, duration: 1, pitch: 72 }
      ]
    }
  };

  return templates[templateId] || templates['basic'];
}

/**
 * 默认模板选项
 */
const defaultTemplates: TemplateOption[] = [
  {
    name: '4/4 拍',
    id: '4-4',
    children: [
      { name: '基础', id: '4-4-basic' },
      { name: '摇滚', id: '4-4-rock' },
      { name: '爵士', id: '4-4-jazz' }
    ]
  },
  {
    name: '3/4 拍',
    id: '3-4',
    children: [
      { name: '华尔兹', id: '3-4-waltz' },
      { name: '爵士华尔兹', id: '3-4-jazz-waltz' }
    ]
  },
  {
    name: '自定义',
    id: 'custom',
    children: [
      { name: '空白', id: 'empty' }
    ]
  }
]; 