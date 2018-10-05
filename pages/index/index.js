 var app=getApp();

var id;
var currentItem;
Page({
  data: {
    //轮播图list
    imgList: [],
    //推荐商品
    recommendProducts: [],
    //productList
    list: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    isChecked: true,
    clock: '',
    currentItem: 0,
    page: 1,
    size: 8,
    WIDTH: app.globalData.sysWidth,
    imageURL: app.imageURL,
    hidden:false
  },

  //事件处理函数
  top: function (that) {
    wx.navigateTo({ url: '../text/text' })
  },
  navigateBack: function () {
    wx.navigateTo({ url: '../dome/dome' })
  },
  onLoad: function () {//页面加载完执行
    var that = this;
    that.getdata(that)
    count_down(that);
  },
  toubu: function (e) {
    // console.log(this.data.WIDTH);
    // console.log(e.currentTarget.dataset.hi);
    wx.navigateTo({
      url: '../action/action?productId=' + e.currentTarget.dataset.hi,
    })
  },
  addToCar: function (e) {
    var index = e.currentTarget.dataset.index;
    var that= this;
    var list = that.data.list;
    var productId = list[index].product.id;
    // console.log(productId );
    if (list[index].normsDetailsList!=null){
      var normsId = list[index].normsDetailsList[0].id;
      app.requestData({
      }, app.url + '/shopCart/joinShopCart?productId=' + productId + '&num=1'+'&normsId=' + normsId, function (event) {
        // console.log(JSON.parse(event.data));
        wx.showToast({
          title: '添加成功',
        })
      });
    }else{
      app.requestData({
      }, app.url + '/shopCart/joinShopCart?productId=' + productId + '&num=1', function (event) {
        // console.log(JSON.parse(event.data));
        wx.showToast({
          title: '添加成功',
        })
      });
    }
  },
  //轮播图
  getdata: function (that) {

  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    console.log('onPullDownRefresh', new Date())
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    var that = this;
    app.requestData({ "page": 1, "size": 8 }, app.url + '/product/getRecommendAndAllProduct', function (event) {
      //console.log(JSON.parse(event.data).map.allProducts[0].product.productName);
     // console.log(JSON.parse(event.data));
      that.setData({
        list: JSON.parse(event.data).map.allProducts,//全部商品
        recommendProducts: JSON.parse(event.data).map.recommendProducts,//推荐商品
        hidden: false
      });
    });
    app.requestData({}, app.url + '/productImage/getProductImage', function (event) {
      //console.log(JSON.parse(event.data).map.allProducts[0].product.productName);
      //console.log(JSON.parse(event.data));
      that.setData({
        imgList: JSON.parse(event.data).data
      });
    });
  },
  loadMore: function () {
    let that = this;
    let page = that.data.page + 1;
    let size = that.data.size;
    let list = that.data.list;
    app.requestData({}, app.url + '/product/getRecommendAndAllProduct?page=' + page + '&size=' + size, function (event){
      // console.log(JSON.parse(event.data).map.allProducts[0].product.productName);
     // console.log(JSON.parse(event.data));
      var list1 = JSON.parse(event.data).map.allProducts;
      if (list1 != null && list1.length > 0) {
        that.setData({
          list: list.concat(list1),//全部商品
          // recommendProducts: JSON.parse(event.data).map.recommendProducts//推荐商品
          page: page
        });
      } else {
        console.log('psge=' + page);
        if (page > 1) {
          wx.showToast({
            title: '没有更多数据了',
            duration: 1500
          })
          that.setData({
            page: page - 1,
            hidden:true
          });
        }
      }
    });
  },
  onShareAppMessage: function () {

  },
  onReachBottom: function () {
    //上拉  
    //console.log("上拉")
    this.loadMore();
  } 
  
})
