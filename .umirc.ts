import { defineConfig } from 'dumi';
const repo = 'blog'
export default defineConfig({
  title: 'NexusFeng',
  mode: 'site',
  logo: '/images/info.png',
  favicon: '/images/info.png',
  base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  publicPath: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  locales: [['zh-CN', '中文'], ['en-US', 'English']],
  navs: {
    "zh-CN": [
      {
        "title": "基础技能▾",
        "children":[
          {"title": "JavaScript","order": 1, "path": "/java-script"},
          {"title": "TypeScript", "path": "/type-script"},
          {"title": "CSS", "path": "/css"}
        ]
      },
      {
        "title": "Vue▾",
        "children":[
          {"title": "vue2", "path": "/vue2"},
          {"title": "vue3", "path": "/vue3"}
        ]
      },
      {
        "title": "构建工具▾",
        "children": [
          {"title": "Webpack", "path": "/webpack"},
          {"title": "vite", "path": ""}
        ]
      },
      {
        "path": "/algorithm",
        "title": "算法"
      },
      {
        "path": "/design-patterns",
        "title": "设计模式"
      },
      {
        "path": "/front-end-engineering",
        "title": "工程化"
      },
      {
        "title": "Interview▾",
        "children": [
          {"title": "原理手写", "path": "/handwritten"},
          {"title": "问答", "path": "/interview"},
          // {"title": "小知识点积累", "path": "/every-day-knowledge"}
        ]
      },
      {
        "title": "GitHub",
        "path": "https://github.com/NexusFeng/blog"
      }
    ]
  }
});
