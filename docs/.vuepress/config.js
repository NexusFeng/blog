module.exports = {
  base: '/blog/',
  title: 'NexusFeng的博客',
  description: '前端学习笔记',
  themeConfig:{
    nav: [{text: "主页", link: "/"      },
        { text: "JavaScript", link: "/JavaScript/" },
        { text: "HTML", link: "/html/"},
        { text: "CSS", link: "/CSS/"   },
        { text: "每日一题", link: "/EveryDayKnowledge/" },
        { text: "Vue", link: "/Vue/"   },
        { text: "工程化", link: "/FrontEndEngineering/" },
        { text: "算法", link: "/algorithm/" }
      ],
  },
  themeConfig:{
    sidebar: 'auto',
    // sidebarDepth: 1 
  }
}

