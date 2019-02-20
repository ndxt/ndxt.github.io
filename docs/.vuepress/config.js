module.exports = {
  title: '南大先腾开源计划',
  description: '南大先腾开源计划',
  port: 8080,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '总体设计', link: '/system_design/' },
      { text: '其他项目', link: '/projects/' },
      { text: '常见问题', link: '/QandA' },
      { text: '更新记录', link: '/UPDATE_LOG' },
    ],
    sidebar: {
      '/system_design/': [
        'concept_design',
        'technical_design',
        'product_design'
      ],
      '/projects/': [
        '',
        'centit-utils',
        'centit-compiler',
        'centit-database',
        'centit-presistence',
        'centit-scaffold',
        'centit-cas',
        'centit-fileserver',
        'centit-stat',
        'centit-search',
        'centit-webim',
        'centit-workflow',
        'centit-workorder',
        'centit-msgpusher',
        'centit-meta-form',
        'centit-dde'
      ]
    }
  }
}
