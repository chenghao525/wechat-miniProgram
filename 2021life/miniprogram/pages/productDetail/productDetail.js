// miniprogram/pages/productDetail/productDetail.js
import {getCorrectImgUrl} from "../../functions"

Page({
  /**
   * Page initial data
   */
  data: {
    name:"",
    price:"",
    detailText:[],
    variantOptionTitle:"",
    variantOptions:[],
    swiperImg:[],
    detailImgPaths:[],
    onSale:false,
    soldOut:false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    var correctDetailImgPaths=[];
    const cloud = wx.cloud;

    // console.log(options.category,options.productId)
    cloud.callFunction({
      name:"getProductDetail",
      data: {collectionName:options.category,productId:options.productId},
      success:res=>{
        console.log("1",res);
        let data=res.result.data;
        let correctSwiperPaths=getCorrectImgUrl()

        that.setData({
          name: data[0].name,
          price: data[0].price,
          onSale: data[0].onSale,
          soldOut: data[0].soldOut,
          detailText: data[0].detailText.detailText,
          variantOptionTitle: data[0].detailText.variantOptionTitle,
          variantOptions: data[0].detailText.variantOptions,
          swiperImg: data[0].img,
          detailImgPaths: data[0].detailImgs,
        })
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