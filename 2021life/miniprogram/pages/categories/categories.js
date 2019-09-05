// miniprogram/pages/categories/categories.js
Page({
  data: {
    categoryList:[],
  },
  onLoad: function (options) {
      let that = this;
      const cloud = wx.cloud;
      cloud.callFunction({
        name:"getCollection",
        data:{collectionName: "categories"},
        success:res => {
          console.log(res);
          that.setData({
            categoryList:res.result.data,
          })
        },
        fail:err => {
          console.log(err);
        }
      })
  },
  toCategory: function(e){
    const category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: `../singleCategory/singleCategory?category=${category}`,
    })
  },
  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },
})