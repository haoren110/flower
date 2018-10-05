var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:'',
    orderList :[
     
    ],
    img: app.imageURL,
    reParam: {
      page: 1,
      size: 5,
      orderStatus:'',
    }
  },
  // 点击标题切换当前页时改变样式
  tab: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { 
      return false; 
    } else {
      this.data.reParam.orderStatus = cur;
      this.data.reParam.page= 1;
    }
    this.setData({
      orderList:[],
      currentTab: cur
    })
    this.ajaxOrders(this.data.reParam);
  },
//支付
  gotopay:function(e){
    var orderId = e.target.dataset.index;
    this.requestPay(orderId);
  },
  gotobuy: function () {
    wx.navigateTo({
      url: '../detailProductList/detailProductList?currentClassification=0',
    })
  },
  onReachBottom: function () {
    //上拉  
    console.log("上拉")
    this.addMore();
  } ,
  //取消订单
  cancelOrder: function (e) {
    var that = this;
    var orderId = e.target.dataset.index;
    app.requestData({ordersId: orderId}, app.url + '/order/revokeOrders', function (event) {
      var data = JSON.parse(event.data);
      if (data.success =="success"){
        wx.showToast({
          title: data.message,
          icon: 'success',
          duration: 2000
        })
        //获取订单列表
        that.setData({
          orderList: [],
        });
        that.data.reParam.page = 1;
        that.ajaxOrders(that.data.reParam);
      }else {
        wx.showToast({
          title: data.message,
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function (e) {
    console.log(e.currentTab);
    if (!e.currentTab){
      var orderStatus = '';
    }
    if (e.currentTab==0){
      var orderStatus ='UN_PAY';
    } else if (e.currentTab == 1){
      var orderStatus = 'WAIT_DELIVER';
    } else if (e.currentTab == 2){
      var orderStatus = 'END_SERVE';
    }
    var that =this;
    //获取订单列表
   // this.data.reParam.page =1;
   that.setData({
     currentTab: orderStatus,
     reParam: {
       page: 1,
       size: 5,
       orderStatus: orderStatus,
     }
   });
    that.ajaxOrders(this.data.reParam);
  },
  // 加载列表
  addMore: function () {
    this.data.reParam.page = this.data.reParam.page+1;
    this.ajaxOrders(this.data.reParam);
  },
  //请求订单列表数据分页
  ajaxOrders:function(data){
    var that = this;
    app.requestData(data, app.url + '/order/memberOrdersList', function (event) {
      var list = JSON.parse(event.data);
      list = list.data;
      if (list != null && list.length>0) {
        that.setData({
          orderList: that.data.orderList.concat(list),
        });
      }else {
        if (that.data.reParam.page > 1 ){
          wx.showToast({
            title: '已是最后一页',
            icon: 'success',
            duration: 2000
          })
        }
        that.data.reParam.page = (that.data.reParam.page > 1 ?that.data.reParam.page - 1:1);
      }
    })
  },
  // 点上面绑定事件是触发的支付
  requestPay: function (orderId) {
    var that =this;
    app.requestData({ orderId: orderId }, app.url + '/weixinPay/typePayMoney', function (event) {
      var payData = JSON.parse(event.data);
      if (payData.success == "success" ) {
        var payParem = JSON.parse(payData.data);
        wx.requestPayment({
          'timeStamp': payParem.timestamp,
          'nonceStr': payParem.noncestr,
          'package': payParem.package,
          'signType': payParem.signType,
          'paySign': payParem.paySign,
          'success': function (res) {
            wx.showModal({
              title: '支付成功通知',
              content: '订单支付成功！',
              showCancel: false,
              success: function () {
                // 支付成功刷新页面,后待发货
                that.setData({
                  orderList: [],
                  currentTab: 'WAIT_DELIVER',
                  reParam: {
                    page: 1,
                    size: 5,
                    orderStatus: 'WAIT_DELIVER',
                  }
                });
                that.data.reParam.page = 1;
                that.ajaxOrders(that.data.reParam);
              }
            })
          },
          'fail': function (res) {
            wx.showModal({
              title: '支付通知',
              content: '订单支付失败或用户取消支付！',
              showCancel: false
            })
          }
        })
      } else {
        wx.showModal({
          title: '支付失败通知',
          content: '支付订单有误或订单已支付',
          showCancel: false
        })
      }

    });
  },
})