const App = getApp();

Page({
  data: {
    imagePath:"",
    autoplay: true,
    indicator_dots: true,
    itemList:[],
    imgURLs:[]
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
    var imagePaths = [];
    const cloud = wx.cloud;
    cloud.callFunction({
      name: "getCollection",
      data:{collectionName:"homeSwiper"},
      success: res => {
        console.log(res)
        res.result.data.map(item => {
          imagePaths.push(item.image);
        })
        that.setData({
          imgURLs: imagePaths,
        })
      }, fail: err => {
        console.log(err)
      }
    })
    cloud.callFunction({
      name: "getCollection",
      data: {collectionName: "homeItem" },
      success: res=>{
        let productList = res.result.data;
        for (let product in productList) {
          let productCategory = productList[product].category.toLowerCase();
          productCategory = productCategory.replace(" ","_");
          productList[product].img = `cloud://cloud2021-01.636c-cloud2021-01-1300062627/${productCategory}/` + productList[product].img;
        }
        that.setData({
          itemList: productList
      })
      },fail: err => {
        console.log(err)
      }
    })
  }
})