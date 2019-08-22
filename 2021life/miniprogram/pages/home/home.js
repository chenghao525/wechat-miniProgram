const App = getApp();

Page({
  data: {
    imagePath:""
  },
  onPicButton: function(){  
    let that=this;
    wx.cloud.downloadFile({
      fileID: "cloud://cloud2021-01.636c-cloud2021-01/banner/WechatIMG1799.jpeg",
      success: res=>{
        console.log(res)
        that.setData({
          imagePath:res.tempFilePath
        })
      },fail: err=>{
        console.log(err)
      } 
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
  }


})