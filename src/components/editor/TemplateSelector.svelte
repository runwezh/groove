<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { generateTemplate } from '../../utils/templateGenerator';
  
  export let currentPath: (string | number)[] = [];
  
  const dispatch = createEventDispatcher();
  let selectedTemplate = 'paragraph';
  let templateOptions: Record<string, any> = {};
  
  // 可用的模板类型
  const templateTypes = [
    { value: 'paragraph', label: '段落' },
    { value: 'heading', label: '标题' },
    { value: 'image', label: '图片' },
    { value: 'list', label: '列表' },
    { value: 'component', label: '组件' }
  ];
  
  // 根据选择的模板类型更新选项
  $: {
    if (selectedTemplate === 'list') {
      templateOptions = { listType: 'ul' };
    } else if (selectedTemplate === 'component') {
      templateOptions = { componentName: 'Demo' };
    } else {
      templateOptions = {};
    }
  }
  
  // 添加模板
  function addTemplate() {
    // @ts-ignore - 假设generateTemplate有另一个重载版本
    const template = generateTemplate(selectedTemplate, templateOptions);
    dispatch('add', { template, path: currentPath });
  }
  
  // 更新列表类型
  function updateListType(event: Event) {
    const target = event.target as HTMLSelectElement;
    templateOptions = { ...templateOptions, listType: target.value };
  }
  
  // 更新组件名称
  function updateComponentName(event: Event) {
    const target = event.target as HTMLInputElement;
    templateOptions = { ...templateOptions, componentName: target.value };
  }
</script>

<div class="template-selector">
  <h3>添加内容</h3>
  
  <div class="template-form">
    <div class="form-group">
      <label for="template-type">内容类型</label>
      <select id="template-type" bind:value={selectedTemplate}>
        {#each templateTypes as type}
          <option value={type.value}>{type.label}</option>
        {/each}
      </select>
    </div>
    
    {#if selectedTemplate === 'list'}
      <div class="form-group">
        <label for="list-type">列表类型</label>
        <select id="list-type" value={templateOptions.listType || 'ul'} on:change={updateListType}>
          <option value="ul">无序列表</option>
          <option value="ol">有序列表</option>
        </select>
      </div>
    {/if}
    
    {#if selectedTemplate === 'component'}
      <div class="form-group">
        <label for="component-name">组件名称</label>
        <input 
          id="component-name" 
          type="text" 
          value={templateOptions.componentName || 'Demo'} 
          on:input={updateComponentName}
        />
      </div>
    {/if}
    
    <button on:click={addTemplate}>添加</button>
  </div>
</div>

<style>
  .template-selector {
    color: #000;
    margin-top: 20px;
    padding: 10px;
    border-top: 1px solid #ccc;
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  .template-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  label {
    font-weight: bold;
    font-size: 14px;
  }
  
  select, input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 8px;
    background-color: #4717f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 5px;
  }
</style>