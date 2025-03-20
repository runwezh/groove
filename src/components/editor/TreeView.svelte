<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let data: any = {};
  export let path: (string | number)[] = [];
  export let expanded = true;
  
  const dispatch = createEventDispatcher();
  
  function getNodeType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }
  
  function handleNodeClick(key: string | number, value: any, fullPath: (string | number)[]) {
    dispatch('select', {
      path: fullPath,
      type: getNodeType(value),
      value: value
    });
  }
  
  function toggleExpand() {
    expanded = !expanded;
  }
  
  // 新增键盘事件处理函数
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpand();
    }
  };
  
  const handleNodeKey = (e: KeyboardEvent, key: string | number, value: any, fullPath: (string | number)[]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNodeClick(key, value, fullPath);
    }
  };
</script>

<div class="tree-node">
  {#if Object.keys(data).length > 0 || Array.isArray(data)}
    <div 
      class="node-header" 
      on:click={toggleExpand}
      on:keydown={handleKey}
      role="button"
      tabindex="0"
    >
      <span class="expander">{expanded ? '▼' : '►'}</span>
      {#if path.length > 0}
        <span class="node-key">{path[path.length - 1]}:</span>
      {:else}
        <span class="node-key">root</span>
      {/if}
    </div>
    
    {#if expanded}
      <div class="node-children">
        {#if Array.isArray(data)}
          {#each data as item, index}
            <div 
              class="array-item" 
              on:click|stopPropagation={() => handleNodeClick(index, item, [...path, index])}
              on:keydown={(e) => handleNodeKey(e, index, item, [...path, index])}
              role="button"
              tabindex="0"
            >
              {#if typeof item === 'object' && item !== null}
                <svelte:self data={item} path={[...path, index]} />
              {:else}
                <div class="leaf-node">
                  <span class="node-key">{index}:</span>
                  <span class="node-value">{JSON.stringify(item)}</span>
                </div>
              {/if}
            </div>
          {/each}
        {:else}
          {#each Object.entries(data) as [key, value]}
            {#if typeof value === 'object' && value !== null}
              <svelte:self data={value} path={[...path, key]} />
            {:else}
              <div 
                class="leaf-node" 
                on:click|stopPropagation={() => handleNodeClick(key, value, [...path, key])}
                on:keydown={(e) => handleNodeKey(e, key, value, [...path, key])}
                role="button"
                tabindex="0"
              >
                <span class="node-key">{key}:</span>
                <span class="node-value">{JSON.stringify(value)}</span>
              </div>
            {/if}
          {/each}
        {/if}
      </div>
    {/if}
  {:else}
    <div 
      class="leaf-node" 
      on:click={() => handleNodeClick(path[path.length - 1], data, path)}
      on:keydown={(e) => handleNodeKey(e, path[path.length - 1], data, path)}
      role="button"
      tabindex="0"
    >
      <span class="node-key">{path[path.length - 1] || 'root'}:</span>
      <span class="node-value">{JSON.stringify(data)}</span>
    </div>
  {/if}
</div>

<style>
  .tree-node {
    font-family: monospace;
    margin-left: 5px;
  }
  
  .node-header {
    cursor: pointer;
    padding: 2px 0;
    user-select: none;
  }
  
  .node-header:hover {
    background-color: #e0e0e0;
  }
  
  .expander {
    display: inline-block;
    width: 15px;
    text-align: center;
  }
  
  .node-children {
    margin-left: 15px;
    border-left: 1px dashed #ccc;
    padding-left: 5px;
  }
  
  .leaf-node {
    padding: 2px 0;
    cursor: pointer;
  }
  
  .leaf-node:hover {
    background-color: #e0e0e0;
  }
  
  .node-key {
    font-weight: bold;
    color: #881280;
    margin-right: 5px;
  }
  
  .node-value {
    color: #1a1aa6;
  }
  
  .array-item {
    margin: 2px 0;
  }
  
  /* 删除未使用的 .object-item 选择器 */
</style>