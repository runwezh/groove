/**
 * 生成不同类型的模板
 */
export const templates = {
  /**
   * 生成空的 JSON 结构
   */
  emptyStructure() {
    return {
      title: "",
      description: "",
      url: "",
      keywords: "",
      hed: "",
      dek: "",
      byline: "",
      sections: []
    };
  },
  
  /**
   * 生成新章节模板
   * @param {number} index - 章节索引
   */
  section(index) {
    return {
      id: `section-${index}`,
      title: "新章节标题",
      chunks: []
    };
  },
  
  /**
   * 生成段落模板
   * @param {string} text - 段落文本
   */
  paragraph(text = "新段落文本") {
    return {
      type: "p",
      text: text
    };
  },
  
  /**
   * 生成标题模板
   * @param {string} text - 标题文本
   */
  heading(text = "新标题") {
    return {
      type: "h3",
      text: text
    };
  },
  
  /**
   * 生成图片模板
   */
  image() {
    return {
      type: "img",
      src: "/images/placeholder.jpg",
      alt: "图片描述",
      caption: "图片说明"
    };
  },
  
  /**
   * 生成列表模板
   * @param {string} listType - 列表类型 (ul/ol)
   */
  list(listType = "ul") {
    return {
      type: listType,
      items: ["列表项 1", "列表项 2", "列表项 3"]
    };
  },
  
  /**
   * 生成组件模板
   * @param {string} componentName - 组件名称
   */
  component(componentName = "Demo") {
    return {
      type: "div",
      component: componentName,
      songId: "song-id",
      notes: ["组件说明 1", "组件说明 2"]
    };
  }
};

/**
 * 根据类型生成模板
 * @param {string} type - 模板类型
 * @param {Object} options - 模板选项
 * @returns {Object} - 生成的模板对象
 */
export function generateTemplate(type, options = {}) {
  switch (type) {
    case 'empty':
      return templates.emptyStructure();
    case 'section':
      return templates.section(options.index || 1);
    case 'paragraph':
      return templates.paragraph(options.text);
    case 'heading':
      return templates.heading(options.text);
    case 'image':
      return templates.image();
    case 'list':
      return templates.list(options.listType);
    case 'component':
      return templates.component(options.componentName);
    default:
      return templates.emptyStructure();
  }
}