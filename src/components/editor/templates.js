// 组件模板库
export const componentTemplates = {
  // 文本段落
  paragraph: {
    type: "p",
    text: "这是一段新的文本内容"
  },
  
  // 带样式的文本
  quote: {
    type: "p",
    text: "这是一段引用文本",
    classname: "quote"
  },
  
  // 滚动组件
  scroll: {
    type: "div",
    component: "Scroll",
    steps: [
      { text: "这是第一步的内容" },
      { text: "这是第二步的内容" }
    ]
  },
  
  // 演示组件
  demo: {
    type: "div",
    component: "Demo",
    songId: "straight",
    notes: ["点击添加说明"]
  },
  
  // 歌曲组件
  song: {
    type: "div",
    component: "Song",
    song: "歌曲名称",
    artist: "艺术家",
    url: "预览音频链接"
  },
  
  // 图片组件
  image: {
    type: "div",
    component: "Image",
    src: "图片路径.jpg",
    alt: "图片描述"
  },
  
  // 列表
  list: {
    type: "ul",
    list: ["第一项", "第二项", "第三项"]
  }
};

// 完整文档模板
export const documentTemplates = {
  // 基础文章模板
  basicArticle: {
    title: "文章标题",
    description: "文章描述内容",
    url: "https://pudding.cool/2023/article-url",
    keywords: "关键词1, 关键词2, 关键词3",
    hed: "大标题",
    dek: "副标题或导语",
    byline: "作者：<a href=# target=_blank>作者名</a>",
    sections: [
      {
        id: "intro",
        title: "介绍",
        chunks: [
          {
            type: "p",
            text: "这是介绍部分的第一段文字。"
          },
          {
            type: "p",
            text: "这是介绍部分的第二段文字。"
          }
        ]
      },
      {
        id: "main-content",
        title: "主要内容",
        chunks: [
          {
            type: "p",
            text: "这是主要内容部分的文字。"
          }
        ]
      }
    ]
  },
  
  // 音乐演示模板
  musicDemo: {
    title: "音乐节奏演示",
    description: "探索音乐节奏的演示",
    url: "https://pudding.cool/2023/music-demo",
    keywords: "音乐, 节奏, 演示",
    hed: "节奏感",
    dek: "探索音乐中的节奏元素",
    byline: "By <a href=# target=_blank>作者名</a>",
    sections: [
      {
        id: "intro",
        chunks: [
          {
            type: "div",
            component: "Scroll",
            steps: [
              {
                text: "欢迎来到这个音乐节奏演示。我们将探索不同类型的节奏。"
              },
              {
                text: "让我们从基本的节奏模式开始。",
                classname: "intro",
                id: "intro-step"
              }
            ]
          }
        ]
      },
      {
        id: "demo-section",
        title: "节奏演示",
        chunks: [
          {
            type: "div",
            component: "Demo",
            songId: "straight",
            notes: ["基础节奏演示"]
          }
        ]
      }
    ]
  }
};