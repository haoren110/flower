//logs.js
const util = require('../../utils/util.js')
var app= getApp();

Page({
  data: {
   
  },
  introduction:function(){
    wx.navigateTo({
      url: '../introduction/introduction',
    })
  },
  score: function () {
    wx.navigateTo({
      url: '../score/score',
    })
  },
  seeOrder:function(){
    wx.navigateTo({
      url: '../productList/productList',
    })
  },
  address:function(){
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.address']);
        if (!res.authSetting['scope.address']) {
         
          wx.authorize({
            scope: 'scope.address',
            success(res) {
              //打开选择地址  
              wx.chooseAddress({
                success: function (res) {

                }
              })//用户授权后执行方法  
            },
            fail(res) {
              //用户拒绝授权后执行  
              wx.showToast({
                title: '去设置里设置',
              })
            }
          })  
        } else {
          //打开选择地址  
          wx.chooseAddress({
            success: function (res) {
             
            }
          })
        }
      },
      fail(res) {
        console.log('调用失败')
      }
    })  
  },
  gotoOrderList:function(){
  wx.navigateTo({
    url: '../productList/productList?currentTab=1',
  })
  },
  
   gotoOrderList1:function () {
    wx.navigateTo({
      url: '../productList/productList?currentTab=0',
    })
  },
 
      onLoad: function (options) { 
     var that = this  
    wx.getUserInfo({
      success: function (res2) {
        console.log(res2.userInfo)
        that.setData({
          userInfo: res2.userInfo
        })
      }
    })
  },
 
 
 
})