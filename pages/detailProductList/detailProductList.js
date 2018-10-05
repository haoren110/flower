var app = getApp();
Page({
  data: {
    /*
      FLOWER_GIFTBOX("鲜花礼盒"),0
    BIRTHDAY_BOUQUET("生日花束"),1
    FLOWERBASKETS_OPENING("开业花篮"),2
    CONFERENCE_TABLE_FLOWER("会议桌花"),3
    WEDDING_FLOWER("婚礼用花"),4
    FLOWER_SACRIFICE("祭奠用花");5
    */
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    menuHidden: true,//菜单栏是否隐藏
    currentClassification: "",//分类的index
    WIDTH: app.globalData.sysWidth,//屏幕宽度
    page: 1,
    size: 8,
    imageURL: app.imageURL,
    categoryList: [],//二级分类
    //productList
    list: [],
    hidden:false
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    console.log(e.target.dataset.current);
    if (this.data.currentTaB == cur) { return false; }
    else {
      let that = this;
      let page = 1;
      let size = 10;
      let currentClassification = that.data.currentClassification;
      console.log(currentClassification);
     // let currentTab = that.data.currentTab;
      let categoryId = that.data.categoryList[cur].id;
      let flowerCategory = '';
      if (currentClassification == 0) {
        flowerCategory = 'FLOWER_GIFTBOX';
      }
      if (currentClassification == 1) {
        flowerCategory = 'BIRTHDAY_BOUQUET';
      }
      if (currentClassification == 2) {
        flowerCategory = 'FLOWERBASKETS_OPENING';
      }
      if (currentClassification == 3) {
        flowerCategory = 'CONFERENCE_TABLE_FLOWER';
      }
      if (currentClassification == 4) {
        flowerCategory = 'WEDDING_FLOWER';
      }
      if (currentClassification == 5) {
        flowerCategory = 'FLOWER_SACRIFICE';
      }
      app.requestData({}, app.url + '/product/getCategoryAndProduct?page=' + page + '&size=' + size + '&flowerCategory=' + flowerCategory + '&categoryId=' + categoryId, function (event) {
       // console.log(JSON.parse(event.data).data);
        that.setData({
          list: JSON.parse(event.data).data.productList,//全部商品
          categoryList: JSON.parse(event.data).data.categoryList,//二级分类
          currentTab: cur,
          page:1
        });
      });
     
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  //菜单栏
  menu: function () {
    var that = this;
    that.setData({
      menuHidden: false
    });
  },
  //菜单栏隐藏
  menuHidden: function () {
    console.log(1111);
    var that = this;
    that.setData({
      menuHidden: true
    });
  },
  //选择分类
  choosefenlei: function (e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    
    this.setData({
      currentClassification: index, 
      currentTab: 0,
      menuHidden: true
    });
    this.reloadData(index);
  },
  addToCar: function (e) {
    var productId = e.currentTarget.dataset.productid;
    // console.log(productId );
    app.requestData({

    }, app.url + '/shopCart/joinShopCart?productId=' + productId + '&num=1', function (event) {
      // console.log(JSON.parse(event.data));
      wx.showToast({
        title: '添加成功',
      })
    });
  },
  loadMore: function () {
    let that = this;
    let page = that.data.page+1;
    let size = that.data.size;
    let currentClassification = that.data.currentClassification;
    let currentTab = that.data.currentTab;
    let categoryId = that.data.categoryList[currentTab].id;
    let flowerCategory = '';
    let list= that.data.list;
    if (currentClassification == 0) {
      flowerCategory = 'FLOWER_GIFTBOX';
    }
    if (currentClassification == 1) {
      flowerCategory = 'BIRTHDAY_BOUQUET';
    }
    if (currentClassification == 2) {
      flowerCategory = 'FLOWERBASKETS_OPENING';
    }
    if (currentClassification == 3) {
      flowerCategory = 'CONFERENCE_TABLE_FLOWER';
    }
    if (currentClassification == 4) {
      flowerCategory = 'WEDDING_FLOWER';
    }
    if (currentClassification == 5) {
      flowerCategory = 'FLOWER_SACRIFICE';
    }
    app.requestData({}, app.url + '/product/getCategoryAndProduct?page=' + page + '&size=' + size + '&flowerCategory=' + flowerCategory + '&categoryId=' + categoryId, function (event) {
      //console.log(JSON.parse(event.data).data);
      var list1 = JSON.parse(event.data).data.productList;
      if(list1 != null&&list1.length>0){
        that.setData({
          list: list.concat(list1),//全部商品
          categoryList: JSON.parse(event.data).data.categoryList,//二级分类
          page:page
        });
      }else{
        //console.log('psge=' + page);
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
  onLoad: function (e) {
    var that = this;
    let currentClassification = e.currentClassification;
    
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        // console.log(calc)
        that.reloadData(currentClassification);
   
        that.setData({
          winHeight: calc,
          currentClassification: e.currentClassification
        });
      }
    });
  },
  onReachBottom: function () {
    //上拉  
    console.log("上拉")
    this.loadMore();
  },
  reloadData: function (currentClassification){
    var that=this;
    
    //let currentClassification = that.data.currentClassification;
    let flowerCategory = '';
    if (currentClassification == 0) {
      flowerCategory = 'FLOWER_GIFTBOX';
    }
    if (currentClassification == 1) {
      flowerCategory = 'BIRTHDAY_BOUQUET';
    }
    if (currentClassification == 2) {
      flowerCategory = 'FLOWERBASKETS_OPENING';
    }
    if (currentClassification == 3) {
      flowerCategory = 'CONFERENCE_TABLE_FLOWER';
    }
    if (currentClassification == 4) {
      flowerCategory = 'WEDDING_FLOWER';
    }
    if (currentClassification == 5) {
      flowerCategory = 'FLOWER_SACRIFICE';
    }
    app.requestData({}, app.url + '/product/getCategoryAndProduct?page=1&size=10&flowerCategory=' + flowerCategory, function (event) {
      console.log(JSON.parse(event.data).data);
      that.setData({
        list: JSON.parse(event.data).data.productList,//全部商品
        categoryList: JSON.parse(event.data).data.categoryList,//二级分类
        hidden:false
      });
    });
  },
  footerTap: app.footerTap
})