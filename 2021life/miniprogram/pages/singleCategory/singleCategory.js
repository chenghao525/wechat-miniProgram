// miniprogram/pages/singleCategory/singleCategory.js
import { getCorrectCategoryName } from "../../functions"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList:[],
    counter:1,
    category:"",
  },
  showDetail: function (e) {
    let productId = e.currentTarget.dataset.id;
    let productCate = e.currentTarget.dataset.cate;
    productCate = getCorrectCategoryName(productCate)
    wx.navigateTo({
      url: `../productDetail/productDetail?category=${productCate}&productId=${productId}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let productCategory = getCorrectCategoryName(options.category);
    this.setData({
      category: productCategory,
    })
    this.loadImages(productCategory);
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function (options) {
    this.loadImages(this.data.category);
  },
  onShareAppMessage: function () {

  },
  loadImages: function (productCategory){
    let that = this;
    let counter = this.data.counter;
    let itemList = this.data.itemList
    const cloud = wx.cloud;
    
    cloud.callFunction({
      name: "getCollection",
      data: { collectionName: productCategory, counter: counter },
      success: res => {
        let productList = res.result.data;
        for (let product in productList) {
          productList[product].img = `cloud://cloud2021-01.636c-cloud2021-01-1300062627/${productCategory}/` + productList[product].img;
        }
        if (productList.length !== 0) {
          wx.showLoading({
            title: 'loading...',
            mask: true,
          })
        } else {
          wx.showToast({
            title: '没有更多了！',
          })
        }
        that.setData({
          itemList: itemList.concat(productList),
          counter: counter + 1,
        })
        setTimeout(() => {
          wx.hideLoading();
        }, 900);
      }, fail: err => {
        console.log(err);
      }
    })
  }
})