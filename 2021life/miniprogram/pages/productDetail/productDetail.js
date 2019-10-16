// miniprogram/pages/productDetail/productDetail.js
Page({




  /**
   * Page initial data
   */
  data: {
    headImgPath:"",
    detailImgPaths:[]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    var imagePaths = [];
    const cloud = wx.cloud;

    // console.log(options.category,options.productId)
    cloud.callFunction({
      name:"getProductDetail",
      data: {collectionName:options.category,productId:options.productId},
      success:res=>{
        console.log("1",res);
      },fail:err=>{
        console.log("2",err);
      }
    })
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