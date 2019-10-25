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
    showDetailText:false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    var correctDetailImgPaths=[];
    const cloud = wx.cloud;

    cloud.callFunction({
      name:"getProductDetail",
      data: {collectionName:options.category,productId:options.productId},
      success:res=>{
        console.log(res);
        let data=res.result.data;
        let swiperImg=[]
        let productDetailedText=""
        data=getCorrectImgUrl(data);
        if(data[0].detailImgs.length==0){
          swiperImg.push(data[0].img);
        }else{
          swiperImg=data[0].detailImgs;
        }
        productDetailedText = this.formatDetailText(data[0].detailText.detailText)
        that.setData({
          name: data[0].name,
          price: data[0].price,
          onSale: data[0].onSale,
          soldOut: data[0].soldOut,
          // detailText: data[0].detailText.detailText,
          detailText: productDetailedText,
          variantOptionTitle: data[0].detailText.variantOptionTitle,
          variantOptions: data[0].detailText.variantOptions,
          swiperImg: swiperImg,
          detailImgPaths: data[0].detailImgs,
        })
      },fail:err=>{
        console.log(err);
      }
    })
  },

  //Show product detailed text
  showDetail: function(){
    let showDetailText=this.showDetailText;
    console.log("show detail")
    this.setData({
      showDetailText : !showDetailText
    })
  },
  //convert the detail text array into list of info 
  formatDetailText(detailTextArray){
    let detailText="";
    if(detailTextArray[0]==="None"||detailTextArray[0][0]==="~"){
      detailText="Enjoy this amazing product!"
    }else{
      for(let index in detailTextArray){
        if(detailTextArray[index]!==""){
          let line = detailTextArray[index];
          line = line.trim();
          detailText += "●"+" "+line+'\n';
          console.log(detailText)
       }
      }
    }
    return detailText
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