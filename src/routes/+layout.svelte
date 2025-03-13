<script>
	import "$styles/app.css";
	import Header from "$components/Header.svelte";
	// 导入其他必要的组件
	import { page } from '$app/stores';
	
	function navigateToEditor(event) {
		// 阻止事件冒泡和默认行为
		event.preventDefault();
		event.stopPropagation();
		
		// 使用延迟执行导航，避免被其他事件处理器干扰
		setTimeout(() => {
			window.location.href = "/editor";
		}, 10);
	}
</script>

<Header />

<nav>
  <ul>
    <li class:active={$page.url.pathname === '/'}>
      <a href="/">首页</a>
    </li>
    <li class:active={$page.url.pathname === '/editor' || $page.url.pathname === '/editor/'}>
      <!-- 使用 Svelte 的事件处理方式 -->
      <a href="/editor" on:click|preventDefault|stopPropagation={navigateToEditor} style="z-index: 9999; position: relative;">JSON 编辑器</a>
    </li>
    <!-- 其他导航链接 -->
  </ul>
</nav>

<!-- 添加调试信息 -->
<!-- <div style="padding: 5px; font-size: 12px;">
  当前路径: {$page.url.pathname}
</div> -->

<main>
  <slot />
</main>

<style>
  nav {
    background-color: #21282d;
    color: white;
    padding: 1rem;
  }
  
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  li {
    margin-right: 1rem;
  }
  
  a {
    color: white;
    text-decoration: none;
  }
  
  .active a {
    font-weight: bold;
    text-decoration: underline;
  }
  
  main {
    padding: 0;
    margin: 0;
    height: calc(100vh - 3rem);
  }
</style>
