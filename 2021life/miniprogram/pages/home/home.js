import { getCorrectImgUrl, getCorrectCategoryName} from "../../functions"
import Toast from '../../miniprogram_npm/vant-weapp/toast/index'
const App = getApp();

Page({
  data: {
    imagePath:"",
    autoplay: true,
    indicator_dots: true,
    itemList:[],
    bannerList:[],
    counter: 1,
  },
  showDetail:function(e){
    let productId = e.currentTarget.dataset.id;
    let productCate = e.currentTarget.dataset.cate;
    productCate = getCorrectCategoryName(productCate)
    wx.navigateTo({
      url: `../productDetail/productDetail?category=${productCate}&productId=${productId}`
    })
  },
  uploadPic: function(){
    let that = this;
    let timestamp = (new Date()).valueOf();
    wx.chooseImage({
      success: chooseResult => {
        wx.showLoading({
          title: 'Uploading...',
        })
        wx.cloud.uploadFile({
          cloudPath:'tempPics/'+timestamp + '.png',
          filePath: chooseResult.tempFilePaths[0],
          success: res => {
            console.log('上传成功', res)
            wx.hideLoading()
            wx.showToast({
              title: '上传图片成功',
            })
          }
        })
      }
    })
  }, 
  onLoad: function (option) {
    let that = this;
    let counter = this.data.counter;
    var imagePaths = [];
    const cloud = wx.cloud;

    wx.showLoading({
      title: 'loading...',
      mask: true,
    })
    cloud.callFunction({
      name: "getCollection",
      data:{collectionName:"homeSwiper"},
      success: res => {
        console.log(res)
        let productList = getCorrectImgUrl(res.result.data);
        that.setData({
          bannerList: productList,
        })
      }, fail: err => {
        console.log(err)
      }
    })
    cloud.callFunction({
      name: "getCollection",
      data: {collectionName: "homeItem", counter: counter},
      success: res=>{
        let productList = getCorrectImgUrl(res.result.data);
        that.setData({
          itemList: productList,
          counter: counter + 1
      })
      },fail: err => {
        console.log(err)
      }
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 100);
  },
  onReachBottom: function () {
    let that = this;
    const cloud = wx.cloud;
    let counter = this.data.counter;

    cloud.callFunction({
      name: "getCollection",
      data: {
        collectionName: "homeItem",
        counter: counter,
      },
      success: res => {
        let productList = that.data.itemList;
        let newProducts = getCorrectImgUrl(res.result.data);

        if (newProducts.length !== 0){
          wx.showLoading({
            title: 'loading...',
            mask: true,
          })
        } else {
          wx.showToast({
            title: 'That\'s it!',
          })
        }
        productList = productList.concat(newProducts);
        that.setData({
          itemList: productList,
          counter: counter + 1,
        })
        setTimeout(() => {
          wx.hideLoading();
        }, 900);
      }, fail: err => {
        console.log(err);
      }
    })
    
  },
})