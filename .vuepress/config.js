module.exports = {
  title: '南大先腾开源计划',
  description: '南大先腾开源计划',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '起步', link: '/guide/' },
      { text: '框架的总体设计', link: '/environment_structure/' },
      { text: '项目介绍', link: '/projects/' },
      { text: '更新记录', link: '/UPDATE_LOG' },
    ],
    sidebar: {
      '/environment_structure/': [
        '',
        'ji-zhu-lu-xian',
        'tong-yong-hou-tai-gong-neng',
        'kuang-jia-ping-tai-jie-shao',
        'hou-tai-fu-wu'
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