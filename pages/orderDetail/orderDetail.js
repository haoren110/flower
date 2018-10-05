var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    orderStatus:'UN_PAY',
    img: app.imageURL,
    sendTime:'',
    orders:{

    },
    orderId:0,
    orderProducts:[

    ]
  },
  onLoad: function (data) {
    var that = this;
    var ordersId = data.ordersId;
    var orderStatus = data.orderStatus;
    that.setData({
      orderStatus: orderStatus,
      orderId: data.ordersId
    })
    this.ajaxOrdersDetail(ordersId);
  },
  //请求订单详情数据
  ajaxOrdersDetail: function (ordersId) {
    var that = this;
    app.requestData({ordersId: ordersId}, app.url + '/order/ordersDetail', function (event) {
      var data = JSON.parse(event.data);
      console.log(data.data.orders);
      // console.log(util.formatTime(1488481383,'Y/M/D h:m:s'));
      var sendTime = util.formatTime(data.data.orders.sendTime, 'Y/M/D');
      that.setData({
        orders: data.data.orders,
        orderProducts: data.data.ordersProductList,
        sendTime: sendTime
      });
    })
  
  },
  //支付
  gotopay: function (e) {
    var orderId = this.data.orderId;
    this.requestPay(orderId);
  },
  //取消订单
  cancelOrder: function (e) {
    var that = this;
    var orderId = this.data.orderId;
    app.requestData({ ordersId: orderId }, app.url + '/order/revokeOrders', function (event) {
      var data = JSON.parse(event.data);
      if (data.success == "success") {
        wx.showToast({
          title: data.message,
          icon: 'success',
          duration: 2000
        })
       
      } else {
        wx.showToast({
          title: data.message,
          icon: 'error',
          duration: 2000
        })
      }
      wx.navigateTo({
        url: '../productList/productList?currentTab=0',
      })
    })
  },
  // 点上面绑定事件是触发的支付
  requestPay: function (orderId) {
    var that = this;
    app.requestData({ orderId: orderId }, app.url + '/weixinPay/typePayMoney', function (event) {
      var payData = JSON.parse(event.data);
      if (payData.success == "success") {
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
                  orderStatus: 'WAIT_DELIVER',
                  orderId: orderId
                })
                this.ajaxOrdersDetail(orderId);
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