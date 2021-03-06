// miniprogram/pages/find/find.js
let keyword='';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalShow:false,
    blogList: [],
  },
 //发布功能
 onPublish() {
  // 判断用户是否授权
  wx.getSetting({
    success: (res) => {
      // console.log(res)
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          //必须用箭头函数，否则会报错
          success: (res) => {
            console.log(res)
            this.onLoginSuccess({
              detail: res.userInfo
            })
          }
        })
      } else {
        this.setData({
          modalShow: true,
        })
      }
    }
  })
},
onLoginSuccess(event) {
  // console.log(event)
  const detail = event.detail
  wx.navigateTo({
    url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
  })
},
onLoginFail() {
  wx.showModal({
    title: '授权用户才能发布',
    content: '',
  })
}, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList();
  }, 
  onSearch(event){
    this.setData({
      blogList:[]
    })
    keyword=event.detail.keyword
    // console.log(event.detail.keyword);
    this._loadBlogList(0);
  },
  //加载博客卡片
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'find',
      data: {
        keyword,
        start,
        count: 10,
        $url: 'list',
      }
    }).then((res) => {
      // console.log(res)
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  goComment(event){
     wx.navigateTo({
       url: '../blog-comment/blog-comment?blogId='+event.target.dataset.blogid,
     })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.setData({
        blogList:[]
      })
      this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event);
    let blogObj=event.target.dataset.blog;
    return {
      title:"鱿鱼教室通知",
      path:`/pages/blog-comment/blog-comment/blogId?=${blogObj._id}`,
      // imageUrl:'../images/fengmian.png'
    }
  }
})