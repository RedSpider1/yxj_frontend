// components/footer/index.js
Component({
  options: {
    addGlobalClass: true
  },
  
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: 'home'
    }
  },

  /**
   * 组件的初始数据
   */ 
  data: {
    primary: getApp().globalData.themes.primary,
    activeColor: '#00FFFF',
    active: '',
    footerHeight: 0,
    items: [
      {
        icon: 'home-o',
        text: '首页',
        defaultPath: 'pages/home/index'
      },
      {
        icon: 'like-o',
        text: '相关',
        defaultPath: 'pages/relation/index'
      },
      {
        icon: 'chat-o',
        text: '消息',
        defaultPath: 'pages/message/index'
      },
      {
        icon: 'user-o',
        text: '我的',
        defaultPath: 'pages/me/index'
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange (event) {
      this.setData({ active: event.detail });
      this.data.items.forEach( item => {
        if(item.text == event.detail) {
          wx.redirectTo({
            url: '/' + item.defaultPath,
          })
        }
      })
    },
    add() {
      console.log('add')
      wx.navigateTo({
        url: '/pages/home/create-platoon/index',
      })
    },
  },
  lifetimes: {
    attached () {
      const pages = getCurrentPages() //获取加载的页面
      const currentPage = pages[pages.length-1] //获取当前页面的对象
      const route = currentPage.route
      this.data.items.forEach( item => {
        if(item.defaultPath == route) {
          this.setData({ active: item.text });
        }
      })

    }
    
  }

})
