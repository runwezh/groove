interface ContentData {
  title?: string;
  description?: string;
  byline?: string;
  sections?: Section[];
}

interface Section {
  id?: string;
  title?: string;
  chunks?: Chunk[];
}

interface BaseChunk {
  type: string;
  text?: string;
}

interface TextChunk extends BaseChunk {
  type: 'p' | 'h3';
  text: string;
}

interface ImageChunk extends BaseChunk {
  type: 'img';
  src: string;
  alt?: string;
  caption?: string;
}

interface ListChunk extends BaseChunk {
  type: 'ul' | 'ol';
  items: string[];
}

interface ComponentChunk extends BaseChunk {
  type: 'div';
  component: string;
  songId?: string;
  notes?: string[];
}

type Chunk = TextChunk | ImageChunk | ListChunk | ComponentChunk;

/**
 * 渲染 JSON 内容到 DOM 元素
 * @param data - JSON 数据
 * @returns 渲染后的 DOM 元素
 */
export async function renderContent(data: ContentData): Promise<HTMLElement> {
  // 创建一个容器元素
  const container = document.createElement('div');
  container.className = 'content-container';
  
  // 添加标题
  if (data.title) {
    const title = document.createElement('h1');
    title.textContent = data.title;
    container.appendChild(title);
  }
  
  // 添加描述
  if (data.description) {
    const description = document.createElement('p');
    description.className = 'description';
    description.textContent = data.description;
    container.appendChild(description);
  }
  
  // 添加作者信息
  if (data.byline) {
    const byline = document.createElement('div');
    byline.className = 'byline';
    byline.textContent = data.byline;
    container.appendChild(byline);
  }
  
  // 渲染章节
  if (data.sections && Array.isArray(data.sections)) {
    for (const section of data.sections) {
      const sectionElement = await renderSection(section);
      container.appendChild(sectionElement);
    }
  }
  
  return container;
}

/**
 * 渲染单个章节
 * @param section - 章节数据
 * @returns 渲染后的章节元素
 */
async function renderSection(section: Section): Promise<HTMLElement> {
  const sectionElement = document.createElement('section');
  sectionElement.id = section.id || '';
  
  // 添加章节标题
  if (section.title) {
    const title = document.createElement('h2');
    title.textContent = section.title;
    sectionElement.appendChild(title);
  }
  
  // 渲染章节内容块
  if (section.chunks && Array.isArray(section.chunks)) {
    for (const chunk of section.chunks) {
      const chunkElement = await renderChunk(chunk);
      sectionElement.appendChild(chunkElement);
    }
  }
  
  return sectionElement;
}

/**
 * 渲染内容块
 * @param chunk - 内容块数据
 * @returns 渲染后的内容块元素
 */
async function renderChunk(chunk: Chunk): Promise<HTMLElement> {
  // 处理不同类型的内容块
  if (chunk.type === 'p' || chunk.type === 'h3') {
    // 段落或三级标题
    const element = document.createElement(chunk.type);
    element.innerHTML = chunk.text || '';
    return element;
  } else if (chunk.type === 'img') {
    // 图片
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = chunk.src;
    img.alt = chunk.alt || '';
    figure.appendChild(img);
    
    if (chunk.caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.innerHTML = chunk.caption;
      figure.appendChild(figcaption);
    }
    
    return figure;
  } else if (chunk.type === 'ul' || chunk.type === 'ol') {
    // 列表
    const list = document.createElement(chunk.type);
    
    if (chunk.items && Array.isArray(chunk.items)) {
      for (const item of chunk.items) {
        const li = document.createElement('li');
        li.innerHTML = item;
        list.appendChild(li);
      }
    }
    
    return list;
  } else if (chunk.type === 'div' && 'component' in chunk) {
    // 组件
    return await renderComponent(chunk);
  } else {
    // 默认处理为 div
    const div = document.createElement('div');
    div.innerHTML = chunk.text || '';
    return div;
  }
}

/**
 * 渲染组件
 * @param componentData - 组件数据
 * @returns 渲染后的组件元素
 */
async function renderComponent(componentData: ComponentChunk): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = `component ${componentData.component.toLowerCase()}`;
  
  // 这里可以根据不同的组件类型进行不同的渲染
  // 例如 Demo 组件
  if (componentData.component === 'Demo') {
    const title = document.createElement('h3');
    title.textContent = '组件预览: ' + componentData.component;
    container.appendChild(title);
    
    if (componentData.songId) {
      const songId = document.createElement('p');
      songId.textContent = `歌曲 ID: ${componentData.songId}`;
      container.appendChild(songId);
    }
    
    if (componentData.notes && Array.isArray(componentData.notes)) {
      const notesList = document.createElement('ul');
      notesList.className = 'notes';
      
      for (const note of componentData.notes) {
        const li = document.createElement('li');
        li.textContent = note;
        notesList.appendChild(li);
      }
      
      container.appendChild(notesList);
    }
  } else {
    // 通用组件渲染
    const placeholder = document.createElement('div');
    placeholder.className = 'component-placeholder';
    placeholder.textContent = `组件: ${componentData.component}`;
    container.appendChild(placeholder);
  }
  
  return container;
} 