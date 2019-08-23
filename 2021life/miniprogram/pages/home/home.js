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
      data:{CollectionName:"merchandise"},
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
      name: "getHomeItems",
      data: { CollectionName: "homeItem" },
      success: res=>{
        console.log(res);
        that.setData({
          itemList:res.result.data
      })
      },fail: err => {
        console.log(err)
      }
    })
  }
})