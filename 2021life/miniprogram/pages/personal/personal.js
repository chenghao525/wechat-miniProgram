// miniprogram/pages/personal/personal.js
//ace2f5da83642629ad45d32e36e5e157 app_secret
const app = getApp()

// const APP_ID = 'wxe9219696ee7e21eb';//输入小程序appid  
// const APP_SECRET = 'ace2f5da83642629ad45d32e36e5e157';//输入小程序app_secret  
// var OPEN_ID = ''//储存获取到openid  
// var SESSION_KEY = ''//储存获取到session_key
// var CODE = ''  

Page({

  /**
   * Page initial data
   */
  data: {
    avatarUrl: './user-unlogin.png',
    logged:false,
    userInfo: {},
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.setData({
            logged: true,
          })
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      this.getOpenId();
    }
  },
  getOpenId: function(){
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid;
      },fail:err => {
        console.log(err)
      }
    })
  }
})