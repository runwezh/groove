<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import LeftPanel from '../../components/editor/LeftPanel.svelte';
  import MiddlePanel from '../../components/editor/MiddlePanel.svelte';
  import RightPanel from '../../components/editor/RightPanel.svelte';
  import { loadJson } from '../../utils/loadJson';

  // 创建存储 JSON 数据的 store
  const jsonData = writable({});
  
  // 默认的空 JSON 结构
  const emptyStructure = {
    title: "",
    description: "",
    url: "",
    keywords: "",
    hed: "",
    dek: "",
    byline: "",
    sections: []
  };

  // 新建文档函数
  function createNewDocument() {
    if (confirm('确定要创建新文档吗？当前未保存的内容将会丢失。')) {
      jsonData.set(structuredClone(emptyStructure));
    }
  }

  onMount(async () => {
    try {
      // 尝试加载现有的 copy.json 数据
      const data = await loadJson('/src/data/copy.json');
      jsonData.set(data);
    } catch (error) {
      console.error('无法加载 JSON 数据:', error);
      // 如果加载失败，使用空结构
      jsonData.set(emptyStructure);
    }
  });

  // 处理 JSON 数据更新
  function handleJsonUpdate(event) {
    jsonData.set(event.detail);
  }
</script>

<svelte:head>
  <title>JSON 编辑器</title>
</svelte:head>

<div class="editor-container">
  <div class="toolbar">
    <button class="new-button" on:click={createNewDocument}>新建文档</button>
  </div>
  <div class="panels-container">
    <LeftPanel {jsonData} on:update={handleJsonUpdate} />
    <MiddlePanel {jsonData} on:update={handleJsonUpdate} />
    <div class="right-panel-wrapper">
      <RightPanel {jsonData} />
    </div>
  </div>
</div>

<style>
  .editor-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }

  .toolbar {
    background-color: #333;
    padding: 8px 16px;
    display: flex;
    align-items: center;
  }

  .new-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  }

  .new-button:hover {
    background-color: #45a049;
  }

  .panels-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .right-panel-wrapper {
    flex: 1;
    background-color: #1e1e1e; /* 深色背景 */
    color: #f0f0f0; /* 浅色文字，提高对比度 */
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  /* 确保右侧面板内的文字颜色适应深色背景 */
  :global(.right-panel-wrapper h1),
  :global(.right-panel-wrapper h2),
  :global(.right-panel-wrapper h3),
  :global(.right-panel-wrapper p) {
    color: #f0f0f0;
  }
</style>