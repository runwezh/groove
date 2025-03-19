<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import TreeView from './TreeView.svelte';
  import FieldEditor from './FieldEditor.svelte';
  import TemplateSelector from './TemplateSelector.svelte';
  import { componentTemplates } from './templates.js';
  
  interface Section {
    id: string;
    title: string;
    chunks: any[];
  }

  interface JsonData {
    sections?: Section[];
    [key: string]: any;
  }
  
  // 接收 store 而不是普通对象
  export let jsonData;
  
  const dispatch = createEventDispatcher();
  let selectedPath: string[] = [];
  let selectedType: 'string' | 'number' | 'boolean' | 'object' | 'array' | null = null;
  let selectedValue: any = null;
  let isEmptyDocument = false;
  
  // 数据变化处理 - 使用 $jsonData 访问 store 值
  $: {
    // 检查是否是空文档或新文档
    isEmptyDocument = !$jsonData?.sections || $jsonData.sections.length === 0;
  }
  
  // 正确使用 store 语法
  $: data = $jsonData;
  
  // 处理节点选择
  function handleNodeSelect(event: { detail: { path: string[]; type: string; value: any } }) {
    selectedPath = event.detail.path;
    selectedType = event.detail.type as 'string' | 'number' | 'boolean' | 'object' | 'array' | null;
    selectedValue = event.detail.value;
  }
  
  // 处理字段更新
  function handleFieldUpdate(event: { detail: { path: string[]; value: any } }) {
    const { path, value } = event.detail;
    let newData = JSON.parse(JSON.stringify(data));
    
    // 根据路径更新数据
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    dispatch('update', newData);
  }
  
  // 添加新章节 - 使用 $jsonData 而不是 jsonData
  function addSection() {
    let newData = structuredClone($jsonData);
    
    if (!Array.isArray(newData.sections)) {
      newData.sections = [];
    }
    
    const newSection = {
      id: `section-${newData.sections.length + 1}`,
      title: "新章节",
      chunks: []
    };
    
    newData.sections.push(newSection);
    dispatch('update', newData);
    
    // 自动选择新创建的章节
    selectedPath = ['sections', String(newData.sections.length - 1)];
    selectedType = 'object';
    selectedValue = newSection;
  }
  
  // 添加块到章节 - 使用 $jsonData
  function addChunkToSection(sectionIndex: number, templateName = 'paragraph') {
    let newData = structuredClone($jsonData);
    
    if (!newData.sections || !newData.sections[sectionIndex]) return;
    if (!Array.isArray(newData.sections[sectionIndex].chunks)) {
      newData.sections[sectionIndex].chunks = [];
    }
    
    // 获取模板
    const template = componentTemplates[templateName as keyof typeof componentTemplates] || { type: "p", text: "新段落文本" };
    const newChunk = structuredClone(template);
    
    newData.sections[sectionIndex].chunks.push(newChunk);
    dispatch('update', newData);
    
    // 自动选择新创建的块
    selectedPath = ['sections', String(sectionIndex), 'chunks', String(newData.sections[sectionIndex].chunks.length - 1)];
    selectedType = 'object';
    selectedValue = newChunk;
  }
  
  // 添加新节点
  function addNode(type: 'section' | 'chunk' | 'component') {
    let newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    
    // 导航到当前选中的路径
    for (let i = 0; i < selectedPath.length; i++) {
      current = current[selectedPath[i]];
    }
    
    // 根据类型添加不同的节点
    if (type === 'section') {
      if (!Array.isArray(newData.sections)) {
        newData.sections = [];
      }
      newData.sections.push({
        id: `section-${newData.sections.length + 1}`,
        title: "新章节",
        chunks: []
      });
    } else if (type === 'chunk') {
      if (selectedPath.length > 0 && selectedPath[0] === 'sections') {
        const sectionIndex = parseInt(selectedPath[1], 10);
        if (!newData.sections[sectionIndex].chunks) {
          newData.sections[sectionIndex].chunks = [];
        }
        newData.sections[sectionIndex].chunks.push({
          type: "p",
          text: "新段落文本"
        });
      }
    } else if (type === 'component') {
      if (selectedPath.length > 2 && selectedPath[0] === 'sections' && selectedPath[2] === 'chunks') {
        const sectionIndex = parseInt(selectedPath[1], 10);
        const chunkIndex = parseInt(selectedPath[3], 10);
        newData.sections[sectionIndex].chunks[chunkIndex] = {
          type: "div",
          component: "Demo",
          songId: "new-song",
          notes: ["点击添加说明"]
        };
      }
    }
    
    dispatch('update', newData);
  }
  
  // 删除节点
  function deleteNode() {
    if (selectedPath.length === 0) return;
    
    let newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    
    // 导航到父节点
    for (let i = 0; i < selectedPath.length - 1; i++) {
      current = current[selectedPath[i]];
    }
    
    // 删除节点
    const lastKey = selectedPath[selectedPath.length - 1];
    if (Array.isArray(current)) {
      current.splice(parseInt(lastKey, 10), 1);
    } else {
      delete current[lastKey];
    }
    
    dispatch('update', newData);
    selectedPath = [];
    selectedType = null;
    selectedValue = null;
  }
  
  // 处理模板添加
  interface TemplateAddEvent {
    detail: {
      template: any;
      path: string[];
    }
  }
  
  function handleTemplateAdd(event: TemplateAddEvent) {
    const { template, path } = event.detail;
    let newData = JSON.parse(JSON.stringify(data));
    
    // 如果路径为空或不是数组，则添加到根节点
    if (!path || path.length === 0) {
      // 如果是段落或组件，添加到第一个章节的 chunks 中
      if (!newData.sections || !Array.isArray(newData.sections) || newData.sections.length === 0) {
        newData.sections = [{
          id: "section-1",
          title: "新章节",
          chunks: [template]
        }];
      } else {
        if (!newData.sections[0].chunks) {
          newData.sections[0].chunks = [];
        }
        newData.sections[0].chunks.push(template);
      }
    } else {
      // 根据路径添加模板
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      const lastKey = path[path.length - 1];
      if (Array.isArray(current)) {
        current.push(template);
      } else if (current[lastKey] && Array.isArray(current[lastKey])) {
        current[lastKey].push(template);
      } else {
        current[lastKey] = template;
      }
    }
    
    dispatch('update', newData);
  }
</script>

<div class="left-panel">
  <div class="panel-header">
    <h2>JSON 结构编辑器</h2>
    <div class="actions">
      <button on:click={() => addNode('section')}>添加章节</button>
      <button on:click={() => addNode('chunk')}>添加块</button>
      <button on:click={() => addNode('component')}>添加组件</button>
      <button on:click={deleteNode} disabled={!selectedPath.length}>删除</button>
    </div>
  </div>
  
  <div class="tree-container">
    <TreeView data={data} on:select={handleNodeSelect} />
  </div>
  
  {#if selectedPath.length > 0}
    <div class="field-editor">
      <FieldEditor 
        path={selectedPath} 
        type={selectedType} 
        value={selectedValue} 
        on:update={handleFieldUpdate} 
      />
    </div>
  {/if}
  
  <TemplateSelector 
    currentPath={selectedPath} 
    on:add={handleTemplateAdd} 
  />
</div>

<style>
  .left-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #ccc;
    height: 100%;
    overflow: hidden;
    background-color: #f5f5f5;
  }
  
  .panel-header {
    padding: 12px;
    border-bottom: 1px solid #ccc;
    background-color: #433017;
    color: #f7f7f7;
  }
  
  .panel-header h2 {
    margin: 0 0 12px 0;
    font-size: 1.3em;
  }
  
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  button {
    padding: 8px 12px;
    background-color: #4717f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: #3a13d6;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .tree-container {
    flex: 1;
    overflow: auto;
    padding: 12px;
    min-height: 200px;
  }
  
  .field-editor {
    padding: 12px;
    border-top: 1px solid #ccc;
    background-color: white;
    max-height: 40%;
    overflow-y: auto;
  }
</style>