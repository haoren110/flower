var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsList:[

    ],
    integral:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var  that = this;
    app.requestData({}, app.url + '/member/memberIglDetailsList', function (event) {
      var data = JSON.parse(event.data);
      console.log(data);
      var integral = data.map.member.integral;
      var detailsList =  data.map.detailsList;
      that.setData({
        detailsList: data.map.detailsList,
        integral: integral
      })
     // console.log(data.map.detailsList)
    })
  }
})