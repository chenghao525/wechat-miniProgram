// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.collectionName === "homeSwiper" || event.collectionName === "categories"){
    return await db.collection(event.collectionName).get()
  }else{
    return await db.collection(event.collectionName).skip((event.counter-1)*6).limit(6).get()
  }
}

