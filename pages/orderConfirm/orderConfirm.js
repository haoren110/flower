var app = getApp();
var util = require('../../utils/util.js');
var currDate = util.formatTime(new Date(), 'Y-M-D');
Page({
  data: {
    date: currDate,//当前时间
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    cityName: "",//地址信息
    countyName: "",
    detailInfo: "",
    errMsg: "",
    nationalCode: "",
    postalCode: "",
    provinceName: "",
    telNumber: "",
    userName: "",
    quantity: 1,//购买数量
    name: "",//订购人name
    phoneNum: "fdsafsad",//订购人电话
    message: "afdsaf",//订购人留言
    request: "sdfasdf",//特殊要求
    normsId: '',//规格id
    productId: '',//商品id
    ids: "",//购物车id
    imageURL: app.imageURL,
    totalPrice: 0,
    currDate: currDate,
    ordersProductList: [

    ]

  },
  onLoad: function (e) {
    var that = this;
    //console.log(e);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          normsId: e.normsId,
          productId: e.productId,
          quantity: e.num,
          ids: e.ids
        });
        if (e.ids) {
          // console.log(e.ids);
          app.requestData({
            ids: e.ids
          }, app.url + '/order/beforeCreateOrders', function (event) {
            // console.log(JSON.parse(event.data));
            that.setData({
              ordersProductList: JSON.parse(event.data).data.ordersProductList,
              totalPrice: JSON.parse(event.data).data.orders.moneyPayOrders.toFixed(2)
            });
          });
        } else {
          console.log(e.normsId == null);
          if (e.normsId == null) {
            app.requestData({
              productId: e.productId,
              // normsId: e.normsId,
              num: e.num
            }, app.url + '/order/beforeCreateOrders', function (event) {
              // console.log(JSON.parse(event.data));
              // moneyPayOrders
              that.setData({
                ordersProductList: JSON.parse(event.data).data.ordersProductList,
                totalPrice: JSON.parse(event.data).data.orders.moneyPayOrders.toFixed(2)
              });
            });
          } else {
            app.requestData({
              productId: e.productId,
              normsId: e.normsId,
              num: e.num
            }, app.url + '/order/beforeCreateOrders', function (event) {
              // console.log(JSON.parse(event.data));
              // moneyPayOrders
              that.setData({
                ordersProductList: JSON.parse(event.data).data.ordersProductList,
                totalPrice: JSON.parse(event.data).data.orders.moneyPayOrders.toFixed(2)
              });
            });
          }

        }

      }
    });
  },


  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },

  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e)
    // console.log(new Date());

    this.setData({
      date: e.detail.value
    })
  },
  pay: function () {

  },
  chooseAdress: function () {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        //console.log(res);
        that.setData({
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          errMsg: res.errMsg,
          nationalCode: res.nationalCode,
          postalCode: res.postalCode,
          provinceName: res.provinceName,
          telNumber: res.telNumber,
          userName: res.userName
        })
      }
    });
  },
  //数量加
  jia() {
    let quantity = this.data.quantity;
    quantity += 1;
    this.setData({
      quantity: quantity
    });

  },
  //数量减
  jian() {
    let quantity = this.data.quantity;
    if (quantity != 1) {
      quantity -= 1;
    }
    this.setData({
      quantity: quantity
    });
  },
  //表单提交
  formSubmit: function (e) {
    //console.log('0000');
    var that = this;
    var myreg = /^1[3|4|5|7|8][0-9]{9}$/;
    // console.log(e.detail.value.name)
    if (e.detail.value.name == "") {
      wx.showToast({
        title: '订购人不能为空',
      })
    } else if (!myreg.test(e.detail.value.phoneNum)) {
      wx.showToast({
        title: '手机号码有误',
      })
    } else if (that.data.cityName == "") {
      wx.showToast({
        title: '地址不能为空',
      })
    } else {
      this.setData({
        name: e.detail.value.name,//订购人name
        phoneNum: e.detail.value.phoneNum,//订购人电话
        message: e.detail.value.message,//订购人留言
        request: e.detail.value.request//特殊要求
      });
      // wx.navigateTo({
      //   url: '../paySuccess/paySuccess',
      // })
      // console.log(that.data.ids.type);
      if (that.data.ids) {
        var param = {
          "name": that.data.userName,
          "addressDetail": that.data.provinceName + that.data.cityName + that.data.cityName + that.data.detailInfo,
          "mobile": that.data.telNumber,
          "time": that.data.date,
          "message": e.detail.value.message,
          "requirements": e.detail.value.request,
          // "sendTime": new Date(),
          "ids": that.data.ids,
          "dgName": e.detail.value.name,
          "dgMobile": e.detail.value.phoneNum,
          "orderSendType": "SELLER",
        }
        that.subOrder(param);
      } else {
        if (that.data.ordersProductList[0].normsId == null) {
          var param = {
            "name": that.data.userName,
            "addressDetail": that.data.provinceName + that.data.cityName + that.data.cityName + that.data.detailInfo,
            "mobile": that.data.telNumber,
            "time": that.data.date,
            // "sendTime": new Date(),
            "message": e.detail.value.message,
            "requirements": e.detail.value.request,
            "productId": that.data.ordersProductList[0].productId,
            // "normsId": that.data.ordersProductList[0].normsId,
            'num': that.data.quantity,
            "dgName": e.detail.value.name,
            "dgMobile": e.detail.value.phoneNum,
            "orderSendType": "SELLER",
          }
          that.subOrder(param);
        } else {
          var param = {
            "name": that.data.userName,
            "addressDetail": that.data.provinceName + that.data.cityName + that.data.cityName + that.data.detailInfo,
            "mobile": that.data.telNumber,
            "time": that.data.date,
            // "sendTime": new Date(),
            "message": e.detail.value.message,
            "requirements": e.detail.value.request,
            "productId": that.data.ordersProductList[0].productId,
            "normsId": that.data.ordersProductList[0].normsId,
            'num': that.data.quantity,
            "dgName": e.detail.value.name,
            "dgMobile": e.detail.value.phoneNum,
            "orderSendType": "SELLER",
          }
          that.subOrder(param);
        }

      }
    }
  },
  //表单提交
  formSubmit1: function (e) {
    // console.log('1111');
    var that = this;
    var myreg = /^1[3|4|5|7|8][0-9]{9}$/;
    console.log(e.detail.value.name)
    if (e.detail.value.name == "") {
      wx.showToast({
        title: '订购人不能为空',
      })
    } else if (!myreg.test(e.detail.value.phoneNum)) {
      wx.showToast({
        title: '手机号码有误',
      })
    }
    else {
      this.setData({
        name: e.detail.value.name,//订购人name
        phoneNum: e.detail.value.phoneNum,//订购人电话
        message: e.detail.value.message,//订购人留言
        request: e.detail.value.request//特殊要求
      });
      // wx.navigateTo({
      //   url: '../paySuccess/paySuccess',
      // })
      if (that.data.ids) {
        var param = {
          "dgName": e.detail.value.name,
          //"addressDetail": that.data.provinceName + that.data.cityName + that.data.cityName + that.data.detailInfo,
          "dgMobile": e.detail.value.phoneNum,
          "time": that.data.date,
          "message": e.detail.value.message,
          "requirements": e.detail.value.request,
          // "sendTime": new Date(),
          "ids": that.data.ids,
          "orderSendType": "MEMBER",
        }
        that.subOrder(param);
      } else {
        if (that.data.ordersProductList[0].normsId == null) {
          var param = {
            "dgName": e.detail.value.name,
            //"addressDetail": that.data.provinceName + that.data.cityName + that.data.cityName + that.data.detailInfo,
            "dgMobile": e.detail.value.phoneNum,
            "time": that.data.date,
            // "sendTime": new Date(),
            "message": e.detail.value.message,
            "requirements": e.detail.value.request,
            "productId": that.data.ordersProductList[0].productId,
            // "normsId": that.data.ordersProductList[0].normsId,
            'num': that.data.quantity,
            "orderSendType": "MEMBER",
          }
          that.subOrder(param);
        } else {
          var param = {
            "dgName": e.detail.value.name,
            //"addressDetail": that.data.provinceName + that.data.cityName + that.data.cityName + that.data.detailInfo,
            "dgMobile": e.detail.value.phoneNum,
            "time": that.data.date,
            // "sendTime": new Date(),
            "message": e.detail.value.message,
            "requirements": e.detail.value.request,
            "productId": that.data.ordersProductList[0].productId,
            "normsId": that.data.ordersProductList[0].normsId,
            'num': that.data.quantity,
            "orderSendType": "MEMBER",
          }
          that.subOrder(param);
        }
      }
    }
  },
  subOrder: function (param) {
    app.requestData(param, app.url + '/order/createOrders', function (event) {
      if (event.data &&  JSON.parse(event.data).success == 'success') {
        var orderId = JSON.parse(event.data).data.id;
        wx.redirectTo({
          url: '../orderDetail/orderDetail?ordersId=' + orderId + '&orderStatus=UN_PAY',
        })
      } else {
        wx.showToast({
          title: '订单信息有误',
        })
      }
    });
  }
})

