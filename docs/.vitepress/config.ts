import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "linjy blog",
  description: "This is linjy blog",
  themeConfig: {
    logo: "https://vuejs.org/logo.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: "前端工程化",
        items: [
          { text: '代码规范工具', link: '/engineering/code' },
          { text: '前端性能优化', link: '/engineering/optimize' }
        ]
      },
      {
        text: 'React',
        items: [
          { text: '横屏签字框', link: '/react/React-sign' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Vue',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: '难点及解决方案',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/linjyuan/linjyBlog.git' }
    ]
  },
  outDir: '../../dist',
})
