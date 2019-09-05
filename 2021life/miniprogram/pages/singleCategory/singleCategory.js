// miniprogram/pages/singleCategory/singleCategory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const cloud = wx.cloud;
    let productCategory = options.category.toLowerCase();
    productCategory=productCategory.replace(" ","_");

    cloud.callFunction({
      name:"getCollection",
      data: {collectionName:productCategory},
      success:res=>{
        console.log(res.result.data);
        let productList = res.result.data;
        for (let product in productList){
          productList[product].img = `cloud://cloud2021-01.636c-cloud2021-01-1300062627/${productCategory}/` + productList[product].img;
        }
        that.setData({
          itemList: res.result.data,
        })
      },fail: err=>{
        console.log(err);
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})