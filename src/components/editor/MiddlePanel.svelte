<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import { saveJson } from '../../utils/saveJson';
  
  // 接收 store
  export let jsonData;
  
  const dispatch = createEventDispatcher();
  let editor;
  let editorValue = '';
  let error: string | null = null;
  let saveStatus = '';
  
  let lastJsonDataString = '';
  
  // 监听 jsonData 变化，更新编辑器内容，但避免覆盖用户正在编辑的内容
  $: {
    try {
      // 确保 $jsonData 存在且是有效对象
      if ($jsonData) {
        const newJsonString = JSON.stringify($jsonData, null, 2);
        // 只有当 store 中的数据真正变化时才更新编辑器内容
        if (newJsonString !== lastJsonDataString) {
          lastJsonDataString = newJsonString;
          editorValue = newJsonString;
        }
      }
    } catch (e) {
      console.error('JSON 格式化错误:', e);
      error = `JSON 格式化错误: ${(e as Error).message}`;
    }
  }
  
  // 初始化编辑器
  onMount(() => {
    // 确保初始化时有数据
    if ($jsonData) {
      editorValue = JSON.stringify($jsonData, null, 2);
    }
  });
  
  // 更新 JSON 数据
  function updateJson() {
    try {
      const newData = JSON.parse(editorValue);
      dispatch('update', newData);
      error = null;
      saveStatus = '更改已应用';
      setTimeout(() => {
        saveStatus = '';
      }, 2000);
    } catch (e) {
      error = `JSON 解析错误: ${(e as Error).message}`;
    }
  }
  
  // 格式化 JSON
  function formatJson() {
    try {
      const parsed = JSON.parse(editorValue);
      editorValue = JSON.stringify(parsed, null, 2);
      error = null;
    } catch (e) {
      error = `JSON 解析错误: ${(e as Error).message}`;
    }
  }
  
  // 保存 JSON 文件
  async function handleSave() {
    try {
      const data = JSON.parse(editorValue);
      const success = await saveJson(data, 'copy.json');
      
      if (success) {
        saveStatus = '保存成功';
        setTimeout(() => {
          saveStatus = '';
        }, 2000);
      } else {
        error = '保存失败';
      }
    } catch (e) {
      error = `保存错误: ${(e as Error).message}`;
    }
  }
</script>

<div class="middle-panel">
  <div class="panel-header">
    <h2>JSON 编辑器</h2>
    <div class="actions">
      <button on:click={formatJson}>格式化</button>
      <button on:click={updateJson}>应用更改</button>
      <button on:click={handleSave}>保存 JSON</button>
    </div>
  </div>
  
  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}
  
  {#if saveStatus}
    <div class="success-message">
      {saveStatus}
    </div>
  {/if}
  
  <div class="editor-container">
    <textarea 
      bind:value={editorValue}
      bind:this={editor}
      spellcheck="false"
      placeholder="在此编辑 JSON 数据..."
      on:input={(e) => {
        // 确保输入事件正常处理
        const inputElement = e.currentTarget;
        editorValue = inputElement.value;
      }}
    ></textarea>
  </div>
</div>

<style>
  .middle-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #ccc;
    height: 100%;
    overflow: hidden;
  }
  
  .panel-header {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    background-color: #433017;
    color: #f7f7f7;
  }
  
  .panel-header h2 {
    margin: 0 0 10px 0;
  }
  
  .actions {
    display: flex;
    gap: 5px;
  }
  
  .actions button {
    padding: 5px 10px;
    background-color: #4717f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .error-message {
    padding: 10px;
    background-color: #ffebee;
    color: #c62828;
    border-bottom: 1px solid #ffcdd2;
  }
  
  .success-message {
    padding: 10px;
    background-color: #e8f5e9;
    color: #2e7d32;
    border-bottom: 1px solid #c8e6c9;
  }
  
  .editor-container {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  
  textarea {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    padding: 10px;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.5;
    tab-size: 2;
    outline: none;
    box-sizing: border-box;
    background-color: #fff; /* 确保背景色正常 */
    color: #333; /* 确保文字颜色正常 */
  }
</style>