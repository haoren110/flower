var WxParse = require('../wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    choose: true,//规格框是否隐藏
    select1: 0,//规格1是否不被选中
    quantity: 1,//规格数量
    price: 199,
    imageURL: app.imageURL,
    buy: 0,
    list: [],
    //商品详情
    //  article: '<div style="text-align:center;">《静夜思》· 李白<br />床前明月光，<br />疑是地上霜。 <br />举头望明月， <br />低头思故乡。<br/><img src="http://www.xiexingcun.com/Poetry/6/images/53e.jpg" alt="" /><br /><img src="http://www.xiexingcun.com/Poetry/6/images/53.jpg" alt="" /><br /><br /><img src="http://www.xiexingcun.com/Poetry/6/images/53b.jpg" alt="" /><br /></div>',
    article: '',
    //轮播图list
    imgList: [],
  },
  normsDetailsList: [],
  qaq: function () { console.log(111111) },
  onLoad: function (options) {
    //从是那个个页面传过来的参数？token=1 就是e.token
    // console.log(options.productId);

    var that = this;
    if (options.productId) {
      app.requestData({}, app.url + '/product/getProductDetails?productId=' + options.productId, function (event) {
        that.setData({
          list: JSON.parse(event.data).map.product,
          //轮播图
          imgList: JSON.parse(event.data).map.imageList,
          //价钱
          price: JSON.parse(event.data).map.product.price,
          //复文本框
          article: JSON.parse(event.data).map.product.description,
          normsDetailsList: JSON.parse(event.data).map.normsDetailsList
        });
        //console.log(that.data.article);
        var temp = WxParse.wxParse('article', 'html', that.data.article, that);
      });
    }

    //设置title的函数
    // wx.setNavigationBarTitle({
    //   title: 'that.data.mername'//页面标题为路由参数
    // })
  },
  choose: function () {

    var that = this;
    console.log(that.data.buy);
    if (that.data.buy == 0) {
      var normsDetailsList = that.data.normsDetailsList;
      console.log(normsDetailsList == null);
      if (normsDetailsList != null && normsDetailsList.length != 0) {
        that.setData({
          choose: false,
          buy: 1,
          price: normsDetailsList[0].price
        })
      } else {
        that.setData({
          choose: false,
          buy: 1
        });
      }
    } else {
      var productId = that.data.list.id;
      var num = that.data.quantity;
      if (that.data.normsDetailsList != null && that.data.normsDetailsList.length != 0) {
        var normsId = that.data.normsDetailsList[that.data.select1].id;
        wx.navigateTo({
          url: '../orderConfirm/orderConfirm?productId=' + productId + '&normsId=' + normsId + '&num=' + num,
        })
      } else {
        wx.navigateTo({
          url: '../orderConfirm/orderConfirm?productId=' + productId + '&num=' + num,
        })
      }
    }


  },
  cancelChoose: function () {
    var that = this;
    that.setData({
      choose: true,
      buy: 0
    });
  },
  gotoBuy: function (e) {
    var that = this;
    var productId = that.data.list.id;
    var num = that.data.quantity;
    if (that.data.normsDetailsList != null && that.data.normsDetailsList.length != 0) {
      var normsId = that.data.normsDetailsList[that.data.select1].id;
      wx.navigateTo({
        url: '../orderConfirm/orderConfirm?productId=' + productId + '&normsId=' + normsId + '&num=' + num,
      })
    } else {
      wx.navigateTo({
        url: '../orderConfirm/orderConfirm?productId=' + productId + '&num=' + num,
      })
    }


  },
  addToShopCar: function () {
    var that = this;
    let productId = that.data.list.id;
    let quantity = that.data.quantity;
    if (that.data.normsDetailsList != null && that.data.normsDetailsList.length != 0) {
      var normsId = that.data.normsDetailsList[that.data.select1].id;

      app.requestData({}, app.url + '/shopCart/joinShopCart?productId=' + productId + '&num=' + quantity + '&normsId=' + normsId, function (event) {
         if(JSON.parse(event.data).success == 'success'){
          //console.log(JSON.parse(event.data));
          wx.showToast({
            title: '添加成功',
          })
         }
        });
      //添加到购物车
      // wx.showToast({
      //   title: '添加成功',
      // })
    } else {
      app.requestData({

      }, app.url + '/shopCart/joinShopCart?productId=' + productId + '&num=' + quantity, function (event) {
        //console.log(JSON.parse(event.data));
        if (JSON.parse(event.data).success == 'success') {
        wx.showToast({
          title: '添加成功',
        })
        }
      });
      // //添加到购物车
      // wx.showToast({
      //   title: '添加成功',
      // })
    }
        // }
     

  },
  spanchoose: function (e) {
    // var that =this;
    const index = e.currentTarget.dataset.id;// 获取data- 传进来的index
    //console.log(select1);
    if (this.data.normsDetailsList[index].enable == false) {
      wx.showToast({
        title: '此规格未启用',
      })
    } else {
      this.setData({
        select1: index,
        price: this.data.normsDetailsList[index].normsPrice
      });
    }

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
  onShareAppMessage: function () {

  }
})