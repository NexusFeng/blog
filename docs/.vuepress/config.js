module.exports = {
  base: '/blog/',
  title: 'NexusFeng的博客',
  description: '前端学习日记',
  themeConfig:{
    nav: [{text: "主页", link: "/"      },
        { text: "node", link: "/node/" },
        { text: "前端", link: "/webframe/"},
        { text: "数据库", link: "/database/"   },
        { text: "android", link: "/android/"   },
        { text: "面试问题", link: "/interview/" }
      ],
  },
  themeConfig:{
    sidebar: 'auto',
    // sidebarDepth: 1 
  }
}

