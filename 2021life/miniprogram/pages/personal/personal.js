// miniprogram/pages/personal/personal.js
Page({

  /**
   * Page initial data
   */
  data: {
    loginModalHidden:false,
    userInfo:"",
  },
  //Confirm authentic wechat info
  loginConfirm: function(){
    var that = this;
    wx.login({
      success(res) {
        console.log(res);
        var code = res.code
        wx.request({
          url: 'https://www.sch1908.cn/index/users/code2seesion',
          method: "post",
          data: {
            code
          },
          success: function (res) {
            console.log(res.data.openid);
            that.setData(res.data);
          },fail: (err)=>{
            console.log(err)
          }
        })
      }
    })
    this.setData({
      loginModalHidden:!this.data.loginModalHidden,
    })
  },
  //Cancel login modal
  loginCancel: function () {
    this.setData({
      loginModalHidden: !this.data.loginModalHidden,
    })

  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})