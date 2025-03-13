<script>
  import Index from '../Index.svelte';
  
  // 接收 jsonData store
  export let jsonData;
  
  // 添加一个标志，告诉 Index 组件它在编辑器预览模式中
  const isPreview = true;
</script>

<div class="right-panel">
  <div class="panel-header">
    <h2>预览</h2>
  </div>
  
  <div class="preview-container">
    <div class="preview-frame">
      <div class="preview-scroll">
        <div class="preview-content">
          <!-- 传递预览模式标志 -->
          <Index data={$jsonData} {isPreview} />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  
  .panel-header {
    padding: 10px;
    border-bottom: 1px solid #444;
    background-color: #433017;
    color: #f7f7f7;
  }
  
  .panel-header h2 {
    margin: 0;
  }
  
  .preview-container {
    flex: 1;
    overflow: hidden;
    padding: 10px;
    background-color: #f5f5f5; /* 添加浅灰色背景 */
  }
  
  /* 创建一个类似iframe的预览框 */
  .preview-frame {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
  }
  
  /* 添加滚动容器 */
  .preview-scroll {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 0;
  }
  
  /* 内容容器，限制宽度并居中 */
  .preview-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0;
    position: relative;
  }
  
  /* 重置Index组件内的全局样式 */
  .preview-content :global(*) {
    box-sizing: border-box;
  }
  
  /* 确保Index组件的article元素不会溢出 */
  .preview-content :global(article) {
    max-width: 100%;
    margin: 0 auto;
    height: auto !important;
    overflow: visible !important;
  }
  
  /* 修复可能的文字颜色问题 */
  .preview-content :global(h1),
  .preview-content :global(h2),
  .preview-content :global(h3),
  .preview-content :global(p) {
    color: var(--color-black, #222222);
  }
  
  /* 确保背景色正确 */
  .preview-content :global(body),
  .preview-content :global(html) {
    background-color: white;
  }
  
  /* 添加占位符样式，用于替代无法加载的资源 */
  .preview-content :global(img[src^="/assets/"]) {
    min-height: 100px;
    background-color: #f0f0f0;
    border: 1px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .preview-content :global(img[src^="/assets/"]):after {
    content: "图片预览";
    position: absolute;
    color: #999;
  }
</style>