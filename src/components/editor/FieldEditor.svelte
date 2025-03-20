<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let path: string[] = [];
  export let type: 'string' | 'number' | 'boolean' | 'object' | 'array' | null = null;
  export let value = null;
  
  const dispatch = createEventDispatcher();
  let editValue = JSON.stringify(value, null, 2);
  let error: string | null = null;
  
  // 当值变化时更新编辑值
  $: {
    if (value !== null) {
      try {
        if (typeof value === 'object') {
          editValue = JSON.stringify(value, null, 2);
        } else {
          editValue = String(value);
        }
      } catch (e) {
        editValue = String(value);
      }
    }
  }
  
  function updateValue() {
    try {
      let newValue;
      
      // 根据类型解析值
      if (type === 'string') {
        newValue = editValue;
      } else if (type === 'number') {
        newValue = Number(editValue);
        if (isNaN(newValue)) throw new Error('无效的数字');
      } else if (type === 'boolean') {
        newValue = editValue.toLowerCase() === 'true';
      } else if (type === 'object' || type === 'array') {
        newValue = JSON.parse(editValue);
      } else {
        newValue = editValue;
      }
      
      dispatch('update', { path, value: newValue });
      error = null;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      updateValue();
    }
  }
</script>

<div class="field-editor-container">
  <h3>编辑 {path.join('.')}</h3>
  
  <div class="field-type">
    <span>类型: {type}</span>
  </div>
  
  {#if type === 'string' || type === 'number'}
    <input 
      type="text" 
      bind:value={editValue} 
      on:blur={updateValue}
      on:keydown={handleKeyDown}
    />
  {:else if type === 'boolean'}
    <select bind:value={editValue} on:change={updateValue}>
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
  {:else if type === 'object' || type === 'array'}
    <textarea 
      bind:value={editValue} 
      rows="10"
      on:blur={updateValue}
    ></textarea>
  {:else}
    <input 
      type="text" 
      bind:value={editValue} 
      on:blur={updateValue}
      on:keydown={handleKeyDown}
    />
  {/if}
  
  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}
  
  <div class="actions">
    <button on:click={updateValue}>更新</button>
  </div>
</div>

<style>
  .field-editor-container {
    padding: 10px;
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
  }
  
  .field-type {
    margin-bottom: 10px;
    color: #666;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    font-family: monospace;
  }
  
  textarea {
    resize: vertical;
  }
  
  .error-message {
    color: red;
    margin-bottom: 10px;
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
  }
  
  button {
    padding: 5px 10px;
    background-color: #4717f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>