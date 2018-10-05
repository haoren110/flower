var app =getApp();
var initdata = function (that) {
  var carts = that.data.carts;
  for (var i = 0; i < carts.length; i++) {
    carts[i].txtStyle = "left:0px";
  }
  that.setData({ carts: carts })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAllSelect: false,//全选状态默认不全选
    totalPrice:0,//总价初始为0
    hasList:false,//列表是否有数据
    delBtnWidth: 80,//删除按钮宽度单位（rpx）
    carts: [],
    imageURL: app.imageURL
   
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;
    app.requestData({}, app.url + '/shopCart/shopCartList', function (event) {
      //console.log(JSON.parse(event.data).map.allProducts[0].product.productName);
     // console.log(JSON.parse(event.data));
      that.setData({
        carts: JSON.parse(event.data).data,
        hasList:true,
        isAllSelect: false,
        totalPrice: 0,
      });
    });
  },
//计算总价
getTotalPrice(){
let carts=this.data.carts;//获取购物车列表
let total=0;
for(let i =0;i<carts.length;i++){//循环列表得到每个数据
  if(carts[i].isSelect){//判断选中才会计算价格
    //console.log(carts[i].price);
    //console.log(carts[i].count.quantity);
    total += carts[i].price * carts[i].num;
  }
}
this.setData({
  carts:carts,
  totalPrice:total.toFixed(2),
});
//console.log(total);
},
  /**
   * 点击函数
   */
  // 去结算
  toBuy() {
    var that =this;
    let carts= that.data.carts;
    var shopCartId=[];
    //统计是否被选中
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].isSelect==true){
        shopCartId.push(carts[i].id);
      }     
    }
    if (this.data.totalPrice!=0){  
    wx.navigateTo({
      url: '../orderConfirm/orderConfirm?ids=' + shopCartId.join(","),
    })
    }else{
      wx.showToast({
        title: '购物车空空如也！',
      })
    }
  },
  //勾选
  //全
  allSelect(e){
    let isAllSelect = this.data.isAllSelect;//是否全选
    isAllSelect =!isAllSelect;
    let carts=this.data.carts;
    //改变所有商品的状态
    for(let i =0;i<carts.length;i++){
      carts[i].isSelect=isAllSelect;
    }
    this.setData({
      isAllSelect: isAllSelect,
      carts:carts,
    });
    this.getTotalPrice();
  },
  //单
  switchSelect(e){
    //console.log(1);
    const index = e.currentTarget.dataset.index;// 获取data- 传进来的index
    let carts = this.data.carts; // 获取购物车列表
    const selected = carts[index].isSelect;
   // console.log(selected);
    carts[index].isSelect=!selected;//changeSelected
    this.setData({
      carts:carts
    });
    this.getTotalPrice();
  },
  //数量加
  jia(e){
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num += 1;
    this.changeCartsNum(index,num);
    this.getTotalPrice();
  },
  //修改购物车数量
  changeCartsNum: function (index,num) {
    var that = this;
    let carts = that.data.carts;
    //let num = carts[index].num;
    let ids = carts[index].id;
    // let normsId = carts[index].normsId;
    // let productId = carts[index].productId;
    app.requestData({
      shopCartId:ids,
      // normsId: normsId,
      num: num,
      // productId: productId
    }, app.url + '/shopCart/updateShopCartNum', function (event) {
      //console.log(JSON.parse(event.data).map.allProducts[0].product.productName);
      //console.log(JSON.parse(event.data));
      carts[index].num = num;
      that.setData({
        carts: carts
      });
    });   
  },
  //数量减
  jian(e){
    const index= e.currentTarget.dataset.index;
    let carts=this.data.carts;
    let num = carts[index].num;
    if(num>1){
      num -= 1;
      this.changeCartsNum(index, num);
      this.getTotalPrice();
    }   
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var that = this
    initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "left:0px";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      //在移动的过程中不更新数据，就不会出现闪烁，在移动结束的时候才让它更新数据
     /* var index = e.currentTarget.dataset.index;
      var carts = this.data.carts;
      carts[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        carts: carts
      });*/
    }
  }, 
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var carts = this.data.carts;
      carts[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        carts: carts
      });
    }
  },  
  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      // console.log(scale);  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error  
    }
  },
  gotobuy:function(){
    wx.navigateTo({
      url: '../detailProductList/detailProductList?currentClassification=0',
    })
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },  
  //点击删除按钮事件  
  delItem: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除？',

      confirmColor:'#f36066',
      cancelColor:'#949494',
      success: function (res) {
        if (res.confirm) {
          //获取列表中要删除项的下标  
          var index = e.target.dataset.index;
          var carts = that.data.carts;
          var ids= carts[index].id;
          app.requestData({
            ids:ids
          }, app.url + '/shopCart/removeShopCart', function (event) {
            //console.log(JSON.parse(event.data).map.allProducts[0].product.productName);
           // console.log(JSON.parse(event.data));
            //移除列表中下标为index的项  
            carts.splice(index, 1);
            that.setData({
              carts: carts
            });
          });  
        } else {
          initdata(that)
        }
      }
    })
  },

})


