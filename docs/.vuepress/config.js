module.exports = {
  title: '南大先腾开源计划',
  description: '南大先腾开源计划',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '总体设计', link: '/system_design/' },
      { text: '相关项目', link: '/projects/' },
      { text: '更新记录', link: '/UPDATE_LOG' },
    ],
    sidebar: {
      '/system_design/': [
        'technical_design',
        'concept_design',
        'product_design'
      ],
      '/projects/': [
        '',
        'centit-commons',
        'centit-framework',
        'centit-services',
      ]
    }
  }
}